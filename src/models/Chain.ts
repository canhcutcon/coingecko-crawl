import { IChainDoc } from "interfaces/IChain"
import { Model, Schema, model } from "mongoose"

const schema = new Schema<any, any>(
    {
        chainId: { type: Number, required: true, unique: true },
        name: { type: String, required: true },
        key: { type: String, default: null, index: true, unique: true },
        symbol: { type: String, default: null, index: true },
    },
    { timestamps: true }
);

export const ChainModel = model<IChainDoc, Model<IChainDoc>>('chain', schema);

export default ChainModel;