import { Document } from "mongoose";

export interface IChain {
    chainId: number | null;
    key: string | null;
    name?: string | null;
    symbol: string | null;
    explorers?: string[] | null,
    faucets?: string[] | null
    decimal?: number | null
    rpc?: string[] | null
    chain?: string | null
    textSearch: string
}

export interface IChainDoc extends Document, IChain { }
