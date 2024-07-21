"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeWebhookService = void 0;
const stripe_1 = __importDefault(require("stripe"));
const cartService_1 = require("./cartService");
const Invoice_1 = __importDefault(require("../models/Invoice"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });
class StripeWebhookService {
    constructor() {
        this.cartService = new cartService_1.CartService();
    }
    async handleWebhook(rawBody, signature) {
        try {
            const webhookSecret = process.env.STRIPE_WEBHOOK_SIGNING_SECRET_KEY;
            const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
            console.log('Received event:', event.type);
            if (event.type === 'checkout.session.completed') {
                console.log('Processing checkout.session.completed');
                await this.handleSuccessfulPayment(event.data.object);
                console.log('Payment processed successfully');
            }
        }
        catch (error) {
            console.error('Error processing webhook:', error);
            throw error;
        }
    }
    async handleSuccessfulPayment(session) {
        const userId = session.metadata?.userId;
        if (!userId) {
            throw new Error('User ID not found in session metadata');
        }
        // TODO Lotfi : maybe à retirer
        await Invoice_1.default.create({
            userId: userId,
            stripeInvoiceId: session.payment_intent,
            amount: session.amount_total / 100,
            status: 'paid'
        });
        console.log('Payment successful for session:', session.id);
        // TODO Lotfi : Vider le panier
        // await this.cartService.clearCart(userId);
    }
}
exports.StripeWebhookService = StripeWebhookService;
