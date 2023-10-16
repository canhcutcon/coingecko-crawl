import { compareSimilarString } from "@/core/routers/utils";
import ChainModel from "@/models/Chain";
import axios from "axios";
import fs from "fs";
import { IChainDoc } from "interfaces/IChain";

interface ChainSeedType {
    seedData: () => Promise<void>;
    updateChain: () => Promise<void>;
    fetchDataChain: () => Promise<IChainDoc>;
}

const ChainSeed: ChainSeedType = {
    seedData: async () => {
        const chainData = JSON.parse(fs.readFileSync('src/modules/Chain/platform_asset.json', 'utf-8'));
        let chains = [];
        if (chainData.length) {
            for (let i = 0; i < chainData.length; i++) {
                const item = chainData[i];
                const c = await ChainModel.findOne({ textSearch: { $regex: `${item?.id || item?.name || item?.chain_identifier}`, $options: 'i' } })
                chains.push({
                    updateOne: {
                        filter: {
                            textSearch: { $regex: `${item?.id || item?.name || item?.chain_identifier}`, $options: 'i' }
                        },
                        update: {
                            $set: {
                                key: item?.id
                            },
                        },
                    },
                })
                if (chains?.length === 100 || i === chains?.length - 1) {
                    await ChainModel.bulkWrite(chains);
                    chains = [];
                }
            }
        }
    },

    updateChain: async () => {
        const bulkWrite = [];
        const chains = await ChainModel.deleteMany({ textSearch: { $regex: "Testnet", $options: 'i' } }).lean();
        console.log("🚀 ~ file: seed.ts:37 ~ updateChain: ~ chains:", chains)
        // for (const chain of chains) {

        //     // bulkWrite.push({
        //     //     updateOne: {
        //     //         filter: {
        //     //             _id: giveAwayCodes[i]._id,
        //     //         },
        //     //         update: {
        //     //             $set: {
        //     //                 campaignId,
        //     //                 assetAddress,
        //     //                 assetValue: uniqueNftIds[i],
        //     //                 chainId,
        //     //             },
        //     //         },
        //     //     },
        //     // })
        // }
    },


    fetchDataChain: async () => {
        const url = "https://chainid.network/page-data/sq/d/3467081199.json";
        const res = await axios.get(url);
        const chainData = res.data?.data?.allChain?.nodes;
        let chains = [];
        let count = 0;
        if (chainData.length) {
            for (const item of chainData) {
                const explorers = item?.explorers?.length ? item?.explorers.map((i) => i.url) : [];
                chains.push({
                    chainId: item?.chainId || null,
                    chain: item?.chain || null,
                    name: item?.name || null,
                    key: item?.id || null,
                    symbol: item?.nativeCurrency?.symbol || "",
                    decimals: item?.nativeCurrency?.decimals || "",
                    explorers: explorers,
                    rpc: item?.rpc,
                    textSearch: `${item?.chain} ${item?.logo} ${item?.name} ${item?.chainId} ${item?.nativeCurrency?.symbol}`
                });
                count++;
                if (chains?.length === 200 || count === chains?.length - 1) {
                    await ChainModel.insertMany(chains);
                    chains = [];
                }
            }
        }
        console.log('Insert done!');
        return chainData
    },



};

export default ChainSeed;
