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
}

export interface ICoinGeckoDoc extends Document, ICoinGecko { }

