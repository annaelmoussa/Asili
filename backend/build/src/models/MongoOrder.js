"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoOrder = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const MongoOrderSchema = new mongoose_1.default.Schema({
    id: String,
    userId: String,
    stripeInvoiceId: String,
    amount: Number,
    status: String,
    shippingAddress: String,
    trackingNumber: String,
    createdAt: Date,
    updatedAt: Date,
    items: [{
            id: String,
            productId: String,
            productName: String,
            productDescription: String,
            quantity: Number,
            priceAtPurchase: Number,
            productImage: String,
        }],
    shipping: {
        id: String,
        address: String,
        status: String,
        orderId: String,
        trackingNumber: String
    },
    payment: {
        id: String,
        stripePaymentId: String,
        amount: Number,
        status: String
    }
});
exports.MongoOrder = mongoose_1.default.model('Order', MongoOrderSchema);
