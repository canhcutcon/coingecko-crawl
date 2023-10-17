import CoinGeckoModel from "@/models/Coingecko";
import axios from "axios";
import CoinGeckoSeed from "./seed";
import { CreateCoinPayload, GetAllCoinQuery, GetAllWithPaginationType, GetPriceChangeQuery } from "./type";
import Boom from "boom";
import { Query } from '../../core/decorators/index';
import { ICoinGeckoDoc } from "interfaces/ICoinGecko";
import { getPagination, paginationData } from "@/core/utils";
const url = "https://api.coingecko.com/api/v3/coins/list";
const urlCoinMarket = "https://api.coingecko.com/api/v3/coins/markets";

export default class CoinGeckoService {
    static async fetchNewToken() {
        console.info("Start crawl data list coin");
        try {
            const response = await await axios.get(url);
            const existingCoins = await this.getAll({ conditions: {}, projections: { key: 1 } }) as ICoinGeckoDoc[];
            const existingCoinIds = existingCoins?.map((coin) => coin.key);
            let missingCoins = []

            for (let i = 0; i < response?.data?.length; i++) {
                const coin = response?.data[i];
                if (!existingCoinIds.includes(coin.id)) {
                    const platforms = await CoinGeckoSeed.getPlatform(coin?.platforms)
                    const newItems = {
                        key: coin?.id,
                        priceChange24h: coin?.price_change_24h || 0,
                        priceChangePercentage24h: coin?.price_change_percentage_24h || 0,
                        symbol: coin?.symbol,
                        name: coin?.name,
                        logo: coin?.image || "",
                        platforms,
                        ranking: coin?.market_cap_rank || null,
                        low24h: coin?.low_24h || 0,
                        high24h: coin?.high_24h || 0,
                        currentPrice: coin?.current_price || 0
                    }
                    missingCoins.push(newItems);
                    if (missingCoins?.length === 200 || i === response?.data?.length - 1) {
                        await CoinGeckoModel.insertMany(missingCoins);
                        missingCoins = [];
                    }
                }
            }
            console.log("missingCoins:", missingCoins)


            if (missingCoins?.length > 0) {
                await CoinGeckoModel.insertMany(missingCoins);
                console.log(`Inserted ${missingCoins.length} missing coins.`);
            }
        } catch (error: any) {
            if (error?.response && error?.response.status === 429) {
                // Handle rate limit error (status code 429)
                console.error("Rate limit exceeded.");
            } else {
                return [];
            }
        }
    }

    static async fetchDataCoinMarket(coinIds: string[]) {
        const itemPerPage = 250;
        const totalPage = Math.ceil(coinIds.length / 250);
        const dataResponse = [];
        console.info(`Start crawl from page ${1} to ${totalPage}`);

        try {
            for (let page = 1; page < totalPage; page++) {
                const startIndex = (page - 1) * itemPerPage;
                const endIndex = startIndex + itemPerPage;
                const ids = coinIds.splice(startIndex, endIndex).join(",");
                const response = await axios.get(urlCoinMarket, {
                    params: {
                        ids,
                        vs_currency: "usd",
                        order: "market_cap_desc",
                        per_page: 250,
                        page,
                        price_change_percentage: "1h,24h,7d",
                        locale: "en",
                        precision: "full",
                    },
                });

                if (response.data?.length) { dataResponse.push(...response.data); }

                console.info(`getCoingecko ${page}/${totalPage} success`);
                await new Promise((resolve) => setTimeout(resolve, 10000));
            }
            return dataResponse;
        } catch (error: any) {
            if (error?.response && error?.response.status === 429) {
                // Handle rate limit error (status code 429)
                console.error("Rate limit exceeded.");
                return dataResponse;
            } else {
                console.error(error.message);
                return [];
            }
        }
    }

    static async getCoinsByRank(rank: number) {
        const coins = await CoinGeckoModel.find({
            ranking: { $lt: rank },
            updatedAt: { $lte: new Date() },
        }).sort({ ranking: 1 });

        if (coins.length) {
            return coins.map((a) => a.key);
        }
        return [];
    }

    static async updateDataCoinGecko() {
        const coinIds = await this.getCoinsByRank(500);
        console.log("coinIds:", coinIds)
        const coinTokens = await this.fetchDataCoinMarket(coinIds);

        if (coinTokens?.length) {
            let bulkWrite = [];
            for (let i = 0; i < coinTokens.length; i++) {
                const token = coinTokens[i];

                bulkWrite.push({
                    updateOne: {
                        filter: {
                            key: token.id,
                            symbol: token.symbol,
                            name: token.name,
                        },
                        update: {
                            $set: {
                                priceChange24h: token.price_change_24h,
                                priceChangePercentage24h: token.price_change_percentage_24h,
                                logo: token?.image,
                                ranking: token?.market_cap_rank,
                                low24h: token?.low_24h,
                                high24h: token?.high_24h,
                                currentPrice: token?.current_price || 0,
                                updatedAt: new Date(),

                            },
                        },
                    },
                });

                if (bulkWrite.length === 100 || i === coinTokens.length - 1) {
                    const result = await CoinGeckoModel.bulkWrite(bulkWrite);
                    bulkWrite = [];
                    console.log(`Update coin price ${result?.modifiedCount ? "success" : "fail"}`);
                }
            }
            return true
        }
    }

    static async getAll({ conditions, projections, sort, pagination }:
        {
            conditions: {},
            projections?: {},
            sort?: {},
            pagination?: {
                limit: number, page: number, skip: number
            }
        }): Promise<GetAllWithPaginationType | ICoinGeckoDoc[]> {

        if (pagination) {
            const { limit, page, skip } = pagination;
            const [total, items] = await Promise.all([
                CoinGeckoModel.countDocuments(conditions),
                CoinGeckoModel.find(conditions).sort({ ranking: 1 }).skip(skip).limit(limit).lean(),
            ]);

            return {
                items,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            };
        }

        return await CoinGeckoModel.find(conditions, projections).lean();
    }

    static async createCoinItem(payload: CreateCoinPayload) {
        const newCoin = await CoinGeckoModel.create(payload);
        if (!newCoin) throw Boom.badRequest('Create new tokens fail!');
        return newCoin;
    }

    static async getTokensCoingeckoBySymbol({ symbols, limit, page }: GetPriceChangeQuery) {

        const coinTokens = await CoinGeckoModel.find({ symbol: { $in: symbols } })
            .sort({ ranking: 1 })
            .select("symbol name priceChange24h priceChangePercentage24h ranking logo chainId platforms")
            .lean();

        for (const coinToken of coinTokens) {
            if (!coinToken?.ranking || coinToken?.ranking === null) {
                // If it's has a null ranking, update the ranking to 0
                await CoinGeckoModel.updateOne(
                    { symbol: coinToken.symbol },
                    { $set: { ranking: 0 } }
                );
            }
        }
        //coingecko-crawl
        return paginationData(coinTokens.filter((i) => i.ranking != null), getPagination({ page, limit }));
    }


}