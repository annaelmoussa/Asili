"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeWebhookService = void 0;
const stripe_1 = __importDefault(require("stripe"));
const crypto_1 = __importDefault(require("crypto"));
const cartService_1 = require("./cartService");
const orderService_1 = require("./orderService");
const ShippingService_1 = require("./ShippingService");
const paymentService_1 = require("./paymentService");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });
class StripeWebhookService {
    constructor() {
        this.cartService = new cartService_1.CartService();
        this.orderService = new orderService_1.OrderService();
        this.shippingService = new ShippingService_1.ShippingService();
        this.paymentService = new paymentService_1.PaymentService();
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
        const cartId = await this.cartService.getCartIdByUserId(userId);
        if (!cartId) {
            throw new Error('Création de commande impossible car aucun article dans le panier.');
        }
        const cartItems = await this.cartService.getCartItems(cartId);
        console.log(cartItems);
        const orderItems = cartItems.map(item => ({
            productId: item.product?.id,
            quantity: item.quantity,
            priceAtPurchase: item.product?.price
        }));
        console.log(orderItems);
        const shippingAddress = this.formatShippingAddress(session.shipping_details?.address);
        console.log('creating order..');
        const order = await this.orderService.createOrder({
            userId: userId,
            stripeInvoiceId: session.payment_intent,
            amount: session.amount_total / 100,
            status: 'paid',
            shippingAddress: shippingAddress,
        }, orderItems);
        if (!order) {
            throw new Error('Error creating Order.');
        }
        else if (!order.id) {
            throw new Error('Something went wrong.');
        }
        console.log('creating shipping..');
        const trackingNumber = this.generateTrackingNumber(userId);
        const shipping = await this.shippingService.createShipping({
            orderId: order.id,
            address: shippingAddress,
            status: 'Pending',
            trackingNumber: trackingNumber
        });
        console.log('creating payment..');
        const payment = await this.paymentService.createPayment({
            userId: userId,
            orderId: order.id,
            stripePaymentId: session.payment_intent,
            amount: session.amount_total / 100,
            status: 'Completed',
            createdAt: Date()
        });
        console.log('Payment successful for session:', session.id);
        await this.cartService.clearCart(userId);
    }
    generateTrackingNumber(userId) {
        const timestamp = Date.now();
        const randomBytes = crypto_1.default.randomBytes(4).toString('hex');
        return `TRK-${userId}-${timestamp}-${randomBytes}`;
    }
    formatShippingAddress(address) {
        if (!address)
            return 'Address not provided';
        const parts = [
            address.line1,
            address.line2,
            address.city,
            address.state,
            address.postal_code,
            address.country
        ].filter(Boolean);
        return parts.join(', ');
    }
}
exports.StripeWebhookService = StripeWebhookService;
