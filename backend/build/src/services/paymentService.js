"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const stripe_1 = __importDefault(require("stripe"));
const Payment_1 = __importDefault(require("../models/Payment"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../../.env") });
const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) {
    throw new Error("STRIPE_SECRET_KEY is not defined in the environment variables");
}
const stripe = new stripe_1.default(stripeSecret, {
    apiVersion: "2024-06-20",
});
class PaymentService {
    constructor() {
        this.baseUrl = process.env.BASE_URL || "http://localhost:8080";
    }
    async createPayment(paymentInfo) {
        return Payment_1.default.create(paymentInfo);
    }
    async createPaymentSession(items, userId) {
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
            success_url: `${this.baseUrl}/payment-success`,
            cancel_url: `${this.baseUrl}/payment-cancel`,
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
