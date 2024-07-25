import { PaymentService } from "../services/paymentService";
import Stripe from 'stripe';

jest.mock('stripe');
const mockedStripe = Stripe as jest.MockedClass<typeof Stripe>;

describe("PaymentService", () => {
  let paymentService: PaymentService;
  let mockStripeInstance: any;

  beforeEach(() => {
    jest.resetAllMocks();
    mockStripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });
    mockedStripe.mockImplementation(() => mockStripeInstance);
    paymentService = new PaymentService();
  });

  describe("createPaymentSession", () => {
    it("should create a payment session with correct line items and return session ID", async () => {
      const items = [
        {
          product: { name: "Product 1", price: 10, image: "http://example.com/image1.jpg" },
          quantity: 1
        },
        {
          product: { name: "Product 2", price: 15 },
          quantity: 2
        }
      ];
      const userId = "user_123";

      const mockSession = {
        id: "sess_123"
      };

      mockStripeInstance.checkout.sessions.create.mockResolvedValue(mockSession as Stripe.Response<Stripe.Checkout.Session>);

      const sessionId = await paymentService.createPaymentSession(items, userId);

      expect(mockStripeInstance.checkout.sessions.create).toHaveBeenCalledWith(expect.objectContaining({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'Product 1',
                images: ['http://example.com/image1.jpg']
              },
              unit_amount: 1000
            },
            quantity: 1
          },
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'Product 2',
                images: []
              },
              unit_amount: 1500
            },
            quantity: 2
          }
        ],
        mode: 'payment',
        success_url: 'http://localhost:8080/payment-success',
        cancel_url: 'http://localhost:8080/payment-cancel',
        metadata: {
          userId: userId
        }
      }));
      expect(sessionId).toEqual("sess_123");
    });

    it("should handle errors from Stripe API", async () => {
      const items = [{
        product: { name: "Product 3", price: 20 },
        quantity: 1
      }];
      const userId = "user_456";

      mockStripeInstance.checkout.sessions.create.mockRejectedValue(new Error("Stripe API error"));

      await expect(paymentService.createPaymentSession(items, userId)).rejects.toThrow("Stripe API error");
    });
  });
});
