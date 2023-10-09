import CacheService from "@/core/redis";
import ChainModel from "@/models/Chain";
import Boom from "boom";
import { IChainDoc } from "interfaces/IChain";

const CACHE_KEY = 'chain::list';
export default class ChainService {
    static async loadCache() {
        await this.getAll();
    }

    static async clearCache() {
        await CacheService.remove('chain::list');
    }

    static async getAll() {
        const cacheValue = await CacheService.get(CACHE_KEY);
        if (cacheValue) {
            return cacheValue;
        }

        const items = await ChainModel.find({}).lean();
        CacheService.set(CACHE_KEY, items);
        return items;
    }

    static async getDetail(chainId: number): Promise<IChainDoc> {
        const items = await this.getAll();
        const result = items.find((i) => parseInt(i.chainId) === chainId);
        if (!result) throw Boom.badRequest('Chain not found');
        return result;
    }
}
