import Stripe from 'stripe';
import crypto from 'crypto';
import { CartService } from './cartService';
import { OrderService } from './orderService';
import { ShippingService } from './ShippingService';
import { PaymentService } from './paymentService';
import { MongoOrder } from '../models/MongoOrder';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

export class StripeWebhookService {
  private cartService: CartService = new CartService();
  private orderService: OrderService = new OrderService();
  private shippingService: ShippingService = new ShippingService();
  private paymentService: PaymentService = new PaymentService();

  async handleWebhook(rawBody: Buffer, signature: string): Promise<void> {
    try {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SIGNING_SECRET_KEY!;
      const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

      console.log('Received event:', event.type);

      if (event.type === 'checkout.session.completed') {
        console.log('Processing checkout.session.completed');
        await this.handleSuccessfulPayment(event.data.object as Stripe.Checkout.Session);
        console.log('Payment processed successfully');
      }
    } catch (error) {
      console.error('Error processing webhook:', error);
      throw error;
    }
  }

  private async handleSuccessfulPayment(session: Stripe.Checkout.Session): Promise<void> {
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
      stripeInvoiceId: session.payment_intent as string,
      amount: session.amount_total! / 100,
      status: 'paid',
      shippingAddress: shippingAddress,
    }, orderItems);

    if (!order) {
      throw new Error('Error creating Order.');
    }

    console.log('creating shipping..');
    const trackingNumber = this.generateTrackingNumber(userId);
    const shipping = await this.shippingService.createShipping({
      orderId: order.id!,
      address: shippingAddress,
      status: 'Pending',
      trackingNumber: trackingNumber
    });

    console.log('creating payment..');
    const payment = await this.paymentService.createPayment({
      userId: userId,
      stripePaymentId: session.payment_intent as string,
      amount: session.amount_total! / 100,
      status: 'Completed'
    });

    if (!order.id) {
      throw new Error('Something went wrong.');
    }

    const orderItemsObject = await this.orderService.getOrderItems(order.id);
    await MongoOrder.create({
      id: order.id,
      userId: order.userId,
      stripeInvoiceId: order.stripeInvoiceId,
      amount: order.amount,
      status: order.status,
      shippingAddress: order.shippingAddress,
      trackingNumber: trackingNumber,
      orderedAt: new Date(),
      items: orderItemsObject.map(item => ({
        id: item.id,
        productId: item?.product?.id,
        productName: item?.product?.name,
        productDescription: item?.product?.description,
        priceAtPurchase: item?.product?.price,
        productImage: item?.product?.image,
        quantity: item.quantity,
      })),
      shipping: {
        id: shipping.id,
        address: shipping.address,
        status: shipping.status,
        trackingNumber: shipping.trackingNumber
      },
      payment: {
        id: payment.id,
        stripePaymentId: payment.stripePaymentId,
        amount: payment.amount,
        status: payment.status
      }
    });

    console.log('Payment successful for session:', session.id);
    await this.cartService.clearCart(userId);
  }

  private generateTrackingNumber(userId: string): string {
    const timestamp = Date.now();
    const randomBytes = crypto.randomBytes(4).toString('hex');

    return `TRK-${userId}-${timestamp}-${randomBytes}`;
  }

  private formatShippingAddress(address?: Stripe.Address): string {
    if (!address) return 'Address not provided';

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