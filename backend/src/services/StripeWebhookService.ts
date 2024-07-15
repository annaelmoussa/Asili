import Stripe from 'stripe';
import { CartService } from './cartService';
import Invoice from '../models/Invoice';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

export class StripeWebhookService {
  private cartService: CartService = new CartService();

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

    // TODO Lotfi : maybe à retirer
    await Invoice.create({
      userId: userId,
      stripeInvoiceId: session.payment_intent as string,
      amount: session.amount_total! / 100,
      status: 'paid'
    });

    console.log('Payment successful for session:', session.id);
    // TODO Lotfi : Vider le panier
    // await this.cartService.clearCart(userId);
  }
}