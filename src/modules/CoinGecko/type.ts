import { Pagination } from "@/core/utils/request-type";
import { ICoinGeckoDoc } from "interfaces/ICoinGecko";
import Joi from "joi";
import { JoiSchema } from "joi-class-decorators";

export class CreateCoinPayload {
    @JoiSchema(Joi.string().required())
    key: string

    @JoiSchema(Joi.string().required())
    symbol: string

    @JoiSchema(Joi.string().required())
    name: string

    @JoiSchema(Joi.number().default(0))
    priceChange24h: number

    @JoiSchema(Joi.number().default(0))
    priceChangePercentage24h: number

    @JoiSchema(Joi.number().default(0))
    currentPrice: number

    @JoiSchema(Joi.string().allow(''))
    logo: string

    @JoiSchema(Joi.array().items({}).single().default([]))
    platforms: object[]

    @JoiSchema(Joi.number().default(null))
    ranking?: number

    @JoiSchema(Joi.number().default(0))
    low24h: number

    @JoiSchema(Joi.number().default(0))
    high24h: number
}

export class GetPriceChangeQuery extends Pagination {
    @JoiSchema(Joi.array().items(Joi.string()).single().default([]))
    symbols: string[]

    @JoiSchema(Joi.number().optional())
    chainId?: number

    @JoiSchema(Joi.string().optional())
    tokenAddress?: string
}

export class GetAllCoinQuery extends Pagination {
    @JoiSchema(Joi.string().optional())
    key?: string
}

export type GetAllWithPaginationType = {
    items: ICoinGeckoDoc[]
    total: number,
    page: number,
    limit: number,
    totalPages: number,
}
