import { Document } from "mongoose";

export interface IChain {
    chainId: number | null;
    key: string | null;
    name?: string | null;
    symbol: string | null;
}

export interface IChainDoc extends Document, IChain { }
