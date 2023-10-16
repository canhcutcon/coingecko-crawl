import ChainModel from '@/models/Chain';
import CoinGeckoModel from '@/models/Coingecko';
import fs from 'fs';
interface CoinGeckoSeedType {
    seedCoin: () => Promise<void>;
    getPlatform: (platforms) => Promise<object>;
}

const CoinGeckoSeed: CoinGeckoSeedType = {
    seedCoin: async () => {
        const data = JSON.parse(fs.readFileSync("./src/modules/CoinGecko/data-coin.json", 'utf-8'));
        let coins = [];
        let count = 0;
        if (data.length) {
            for (const item of data) {
                const platforms = await CoinGeckoSeed.getPlatform(item?.platforms)
                const newItems = {
                    key: item?.id,
                    priceChange24h: item?.price_change_24h || 0,
                    priceChangePercentage24h: item?.price_change_percentage_24h || 0,
                    symbol: item?.symbol,
                    name: item?.name,
                    logo: item?.image || "",
                    platforms,
                    ranking: item?.market_cap_rank || null,
                    low24h: item?.low_24h || 0,
                    high24h: item?.high_24h || 0,
                    currentPrice: item?.current_price || 0
                }
                coins.push(newItems);
                count++;
                if (coins?.length === 200 || count === coins?.length - 1) {
                    await CoinGeckoModel.insertMany(coins);
                    coins = [];
                }

            }
            console.log('Done :33');
        }
    },

    getPlatform: async (platforms) => {
        const platform = {};

        for (const item of Object.keys(platforms)) {
            const chain = await ChainModel.findOne({ key: item }).lean();
            if (!chain?.chainId) continue
            platform[chain?.chainId] = platforms[item];
        }

        return platform;
    },
};

export default CoinGeckoSeed;

