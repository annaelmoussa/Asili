import Stripe from "stripe";
import { IProduct } from "../interfaces/IProduct";
import Payment from "../models/Payment";
import { IPayment } from "../interfaces/IPayment";
const stripeSecret =
  process.env.SECRET_KEY ??
  "sk_test_51PNYtAHbf3sdXCnMoA4cC38iQtbdGIlNMSnNQzROT5jPbgpZbEb0T9yuH8ckgespAkcA9YIGTpdkerkY5XQFNT5W00tv0XHsXE";

if (!stripeSecret) {
  throw new Error(
    "STRIPE_SECRET_KEY is not defined in the environment variables"
  );
}
const stripe = new Stripe(stripeSecret, {
  apiVersion: "2024-06-20",
});

export interface PaymentSessionRequest {
  id?: string;
  product: Partial<IProduct>;
  quantity: number;
}

export class PaymentService {
  private baseUrl = process.env.BASE_URL || "http://localhost:8080";
  async createPayment(paymentInfo: IPayment): Promise<IPayment> {
    return Payment.create(paymentInfo);
  }

  async createPaymentSession(
    items: PaymentSessionRequest[],
    userId: string
  ): Promise<string> {
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
