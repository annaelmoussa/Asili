"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
const Payment_1 = __importDefault(require("../models/Payment"));
dotenv_1.default.config();
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not defined in the environment variables");
}
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20",
});
class PaymentService {
    async createPaymentSession(items, userId) {
        console.log(items);
        const lineItems = items.map((item) => ({
            price_data: {
                currency: "eur",
                product_data: {
                    name: item.product?.name || "Unknown product",
                    images: item.product?.image ? [item.product.image] : [],
                },
                unit_amount: Math.round((item.product?.price ?? 0) * 100),
            },
            quantity: item.quantity,
        }));
        console.log(lineItems);
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: "http://localhost:8080/payment-success",
            cancel_url: "http://localhost:8080/payment-cancel",
            metadata: {
                userId: userId,
            },
        });
        return session.id;
    }
    async getAllPayments() {
        try {
            const payments = await Payment_1.default.findAll();
            return payments.map((payment) => payment.toJSON());
        }
        catch (error) {
            console.error("Error fetching payments:", error);
            throw error;
        }
    }
}
exports.PaymentService = PaymentService;