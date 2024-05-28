import mongoose, { Document, Schema } from 'mongoose';
import { IStock } from '../interfaces/IStock';

export type IStockMongo = IStock & Document;

const stockSchema: Schema = new Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    alertThreshold: { type: Number, required: true },
}, {
    timestamps: true
});

const StockMongo = mongoose.model<IStockMongo>('Stock', stockSchema);

export default StockMongo;
