"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoOrder = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const MongoOrderSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    stripeInvoiceId: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, required: true, index: true },
    shippingAddress: String,
    trackingNumber: String,
    createdAt: { type: Date, required: true, index: true },
    updatedAt: { type: Date, required: true },
    items: [
        {
            id: String,
            productId: { type: String, index: true },
            productName: String,
            productDescription: String,
            quantity: Number,
            priceAtPurchase: Number,
            productImage: String,
        },
    ],
    shipping: {
        id: String,
        address: String,
        status: String,
    },
    payment: {
        id: String,
        stripePaymentId: String,
        amount: Number,
        status: String,
    },
}, { timestamps: true });
// Ajout d'index composites pour des requêtes courantes
MongoOrderSchema.index({ userId: 1, createdAt: -1 });
MongoOrderSchema.index({ status: 1, createdAt: -1 });
// Index pour la recherche full-text si nécessaire
MongoOrderSchema.index({
    "items.productName": "text",
    "items.productDescription": "text",
});
exports.MongoOrder = mongoose_1.default.model("Order", MongoOrderSchema);
