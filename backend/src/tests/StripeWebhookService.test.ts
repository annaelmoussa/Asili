import { StripeWebhookService } from "../services/stripeWebhookService";
import Stripe from 'stripe';
import Invoice from '../models/Invoice';
import { CartService } from '../services/cartService';

jest.mock('stripe');
jest.mock('../models/Invoice');
jest.mock('../services/cartService');

describe("StripeWebhookService", () => {
  let webhookService: StripeWebhookService;
  let mockStripe: jest.MockedClass<typeof Stripe>;
  let testEvent: Stripe.Event;

  beforeEach(() => {
    jest.resetAllMocks();
    mockStripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' }) as jest.MockedClass<typeof Stripe>;
    webhookService = new StripeWebhookService();
    testEvent = {
      id: 'evt_1',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test',
          payment_intent: 'pi_123',
          amount_total: 2000,
          metadata: {
            userId: 'user_123'
          }
        }
      },
      created: Math.floor(Date.now() / 1000),
      livemode: false,
      pending_webhooks: 1,
      request: { id: null, idempotency_key: null }
    } as Stripe.Event;
  });

  describe("handleWebhook", () => {
    it("should process checkout.session.completed event and create an invoice", async () => {
      const rawBody = Buffer.from(JSON.stringify(testEvent));
      const signature = 't_signature';

      Stripe.prototype.webhooks.constructEvent.mockImplementation(() => testEvent);

      await webhookService.handleWebhook(rawBody, signature);

      expect(Invoice.create).toHaveBeenCalledWith({
        userId: 'user_123',
        stripeInvoiceId: 'pi_123',
        amount: 20, // amount_total is divided by 100
        status: 'paid'
      });

      // Uncomment the following if clearCart is to be tested
      // expect(CartService.prototype.clearCart).toHaveBeenCalledWith('user_123');
    });

    it("should throw an error if webhook signature verification fails", async () => {
      const rawBody = Buffer.from(JSON.stringify(testEvent));
      const signature = 'bad_signature';

      Stripe.prototype.webhooks.constructEvent.mockImplementation(() => {
        throw new Error('Signature verification failed');
      });

      await expect(webhookService.handleWebhook(rawBody, signature)).rejects.toThrow('Signature verification failed');
    });

    it("should throw an error if userId is missing in metadata", async () => {
      testEvent.data.object.metadata = {}; // Remove userId
      const rawBody = Buffer.from(JSON.stringify(testEvent));
      const signature = 't_signature';

      Stripe.prototype.webhooks.constructEvent.mockImplementation(() => testEvent);

      await expect(webhookService.handleWebhook(rawBody, signature)).rejects.toThrow('User ID not found in session metadata');
    });
  });
});
