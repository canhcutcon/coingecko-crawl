import { IChainDoc } from "interfaces/IChain"
import { Model, Schema, model } from "mongoose"

const schema = new Schema<any, any>(
    {
        chainId: { type: Number },
        name: { type: String },
        key: { type: String, index: true },
        symbol: { type: String, default: null, index: true },
        explorers: { type: [String], default: [] },
        faucets: { type: [String], default: [] },
        decimal: Number,
        rpc: { type: [String], default: [] },
        chain: String,
        textSearch: String
    },
    { timestamps: true }
);

export const ChainModel = model<IChainDoc, Model<IChainDoc>>('chain', schema);

export default ChainModel;