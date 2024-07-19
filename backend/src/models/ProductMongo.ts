import mongoose, { Document, Schema } from "mongoose";

export interface IProductMongo extends Document {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  brandId: string;
  stock: number;
  image?: string;
  isPromotion: boolean;
  brandName?: string;
  categoryName?: string;
  lowStockThreshold: number;
  stockHistory: { date: Date; quantity: number }[];
}

const ProductMongoSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    categoryId: { type: String, required: true },
    brandId: { type: String, required: true },
    stock: { type: Number, required: true },
    image: { type: String },
    isPromotion: { type: Boolean, required: true },
    brandName: { type: String },
    categoryName: { type: String },
    lowStockThreshold: { type: Number, required: true, default: 10 },
    stockHistory: [
      {
        date: { type: Date, required: true },
        quantity: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Création d'index pour améliorer les performances des requêtes
ProductMongoSchema.index({ name: "text", description: "text" });
ProductMongoSchema.index({ categoryId: 1, brandId: 1 });
ProductMongoSchema.index({ price: 1 });
ProductMongoSchema.index({ stock: 1 });
ProductMongoSchema.index({ isPromotion: 1 });

const ProductMongo = mongoose.model<IProductMongo>(
  "Product",
  ProductMongoSchema
);

export default ProductMongo;
