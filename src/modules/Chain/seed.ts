import ChainModel from "@/models/Chain";
import fs from "fs";

interface ChainSeedType {
    seedData: () => Promise<void>;
}

const ChainSeed: ChainSeedType = {
    seedData: async () => {
        const chainData = JSON.parse(fs.readFileSync('src/modules/Chain/platform_asset.json', 'utf-8'));
        const chains = [];
        if (chainData.length) {
            for (const item of chainData) {
                chains.push({
                    chainId: item?.chain_identifier || null,
                    name: item?.name || null,
                    key: item?.id || null,
                    symbol: item?.shortname || "",
                })
            }

            await ChainModel.insertMany(chains);
            console.log('Insert done!');
        }
    },
};

export default ChainSeed;
