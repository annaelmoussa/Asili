import Stripe from "stripe";
import { IProduct } from "../interfaces/IProduct";
import dotenv from "dotenv";
import Payment from "../models/Payment";
import { IPayment } from "../interfaces/IPayment";

dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "STRIPE_SECRET_KEY is not defined in the environment variables"
  );
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export interface PaymentSessionRequest {
  id?: string;
  product: Partial<IProduct>;
  quantity: number;
}

export class PaymentService {
  async createPaymentSession(
    items: PaymentSessionRequest[],
    userId: string
  ): Promise<string> {
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
    } as Stripe.Checkout.SessionCreateParams);

    return session.id;
  }
  async getAllPayments(): Promise<IPayment[]> {
    try {
      const payments = await Payment.findAll();
      return payments.map((payment) => payment.toJSON() as IPayment);
    } catch (error) {
      console.error("Error fetching payments:", error);
      throw error;
    }
  }
}
