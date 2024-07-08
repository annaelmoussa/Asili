import mongoose from "mongoose";
import { IProduct } from "../interfaces/IProduct";

const ProductSchema = new mongoose.Schema<IProduct>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  image: { type: String },
  brand: { type: String },
  isPromotion: { type: Boolean },
});

ProductSchema.index({ name: "text", description: "text" });

const ProductMongo = mongoose.model<IProduct>("Product", ProductSchema);

export default ProductMongo;
