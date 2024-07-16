import mongoose from "mongoose";
import { IProduct } from "../interfaces/IProduct";

const ProductSchema = new mongoose.Schema<IProduct>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  brandId: { type: String, required: true },
  categoryId: { type: String, required: true },
  stock: { type: Number, required: true },
  image: { type: String },
  isPromotion: { type: Boolean, default: false },
  brandName: { type: String },
  categoryName: { type: String },
});

ProductSchema.index({ name: "text", description: "text" });

const ProductMongo = mongoose.model<IProduct>("Product", ProductSchema);

export default ProductMongo;
