import { Document } from "mongoose";

export interface IAddressPlatform {
    chainId?: number | string,
    address?: string
}

export interface ICoinGecko {
    key: string;
    priceChange24h: number;
    priceChangePercentage24h: number;
    symbol: string | null;
    name: string | null;
    logo: string | null;
    platforms: object[];
    ranking: number | null;
    low24h: number;
    high24h: number;
    currentPrice: number;
    chainId: number | null
}

export interface ICoinListRaw {
    id?: string;
    name?: string;
    chain_identifier?: number;
    shortname?: string;
    platforms?: object[];
}

export interface ICoinMarketRaw {
    id?: string;
    name?: string;
    chain_identifier?: number;
    shortname?: string;
}
export interface ICoinGeckoDoc extends Document, ICoinGecko { }

