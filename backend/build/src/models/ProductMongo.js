"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const ProductMongoSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
});
ProductMongoSchema.index({ name: "text", description: "text" });
ProductMongoSchema.index({ categoryId: 1, brandId: 1 });
ProductMongoSchema.index({ price: 1 });
ProductMongoSchema.index({ stock: 1 });
ProductMongoSchema.index({ isPromotion: 1 });
ProductMongoSchema.index({ brandName: 1, categoryName: 1 });
const ProductMongo = mongoose_1.default.model("Product", ProductMongoSchema);
exports.default = ProductMongo;
