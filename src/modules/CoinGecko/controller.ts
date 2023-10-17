import { Controller, Get, Query, QueryValidation } from "@/core/decorators";
import CoinGeckoService from "./service";
import { GetAllCoinQuery, GetPriceChangeQuery } from './type';
import { getPagination } from "@/core/utils";

@Controller('/coin', 'Coingecko')
export default class CoinGeckoController {
    @Get('/', 'Get all price change tokens')
    @QueryValidation(GetAllCoinQuery)
    async getAll(@Query() query: GetAllCoinQuery) {
        const { key } = query;
        const conditions = {
            ranking: { $ne: null },
            ...(key && {
                $or: [
                    { name: { $regex: key, $options: 'i' } },
                    { symbol: { $regex: key, $options: 'i' } },
                    { key: { $regex: key, $options: 'i' } },
                ]
            })
        };

        return await CoinGeckoService.getAll({
            conditions: conditions,
            projections: {},
            pagination: getPagination(query)
        });
    }

    @Get('/price-change', 'Get all price change tokens')
    @QueryValidation(GetPriceChangeQuery)
    async getAllTokensPriceChange(@Query() query: GetPriceChangeQuery) {
        return await CoinGeckoService.getTokensCoingeckoBySymbol(query);
    }

}