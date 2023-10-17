import { Controller, Get, Query, QueryValidation } from "@/core/decorators";
import CoinGeckoService from "./service";
import { GetAllCoinQuery, GetPriceChangeQuery } from './type';
import { getPagination } from "@/core/utils";

@Controller('/coin', 'Coingecko')
export default class CoinGeckoController {
    @Get('/', 'Get all price change tokens')
    @QueryValidation(GetAllCoinQuery)
    async getAll(@Query() query: GetAllCoinQuery) {
        return await CoinGeckoService.getAll({
            conditions: { ranking: { $ne: null } },
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