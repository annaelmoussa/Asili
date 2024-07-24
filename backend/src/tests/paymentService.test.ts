import {
  PaymentService,
  PaymentSessionRequest,
} from "../services/paymentService";
import Payment from "../models/Payment";
import Stripe from "stripe";
import { IPayment } from "../interfaces/IPayment";


jest.mock("../models/Payment");
jest.mock("stripe");

describe("PaymentService", () => {
  let paymentService: PaymentService;
  let mockStripe: jest.Mocked<Stripe>;

  beforeEach(() => {
    paymentService = new PaymentService();
    mockStripe = {
      checkout: {
        sessions: {
          create: jest.fn(),
        },
      },
    } as unknown as jest.Mocked<Stripe>;
    (Stripe as unknown as jest.Mock).mockReturnValue(mockStripe);
    jest.clearAllMocks();
  });

  describe("createPayment", () => {
    it("should create a new payment", async () => {
      const mockPaymentInfo: IPayment = {
        id: "1",
        userId: "user1",
        orderId: "order1",
        stripePaymentId: "pi_123456",
        amount: 100,
        status: "completed",
        createdAt: new Date().toISOString(),
      };
      (Payment.create as jest.Mock).mockResolvedValue(mockPaymentInfo);

      const result = await paymentService.createPayment(mockPaymentInfo);

      expect(Payment.create).toHaveBeenCalledWith(mockPaymentInfo);
      expect(result).toEqual(mockPaymentInfo);
    });
  });

  describe("getAllPayments", () => {
    it("should return all payments", async () => {
      const mockPayments: IPayment[] = [
        {
          id: "1",
          userId: "user1",
          orderId: "order1",
          stripePaymentId: "pi_123456",
          amount: 100,
          status: "completed",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          userId: "user2",
          orderId: "order2",
          stripePaymentId: "pi_789012",
          amount: 200,
          status: "pending",
          createdAt: new Date().toISOString(),
        },
      ];
      (Payment.findAll as jest.Mock).mockResolvedValue(
        mockPayments.map((payment) => ({
          toJSON: () => payment,
        }))
      );

      const result = await paymentService.getAllPayments();

      expect(Payment.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockPayments);
    });

    it("should handle errors when fetching payments", async () => {
      const mockError = new Error("Database error");
      (Payment.findAll as jest.Mock).mockRejectedValue(mockError);

      await expect(paymentService.getAllPayments()).rejects.toThrow(
        "Database error"
      );
    });
  });
});
