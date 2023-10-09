import { ICoinGeckoDoc } from "interfaces/ICoinGecko";
import { Model, Schema, model } from "mongoose";

const schema = new Schema<any, any>(
    {
        key: { type: String, default: null, index: true },
        symbol: { type: String, default: null, index: true },
        priceChange24h: { type: Number, default: 0 },
        priceChangePercentage24h: { type: Number, default: 0 },
        name: { type: String, default: null },
        logo: { type: String, default: null },
        platforms: {
            type: [Schema.Types.Mixed]
        },
        ranking: { type: Number, default: null, index: true },
        low24h: { type: Number, default: 0 },
        high24h: { type: Number, default: 0 },
        currentPrice: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export const CoinGeckoModel = model<ICoinGeckoDoc, Model<ICoinGeckoDoc>>('coingecko', schema);

export default CoinGeckoModel;