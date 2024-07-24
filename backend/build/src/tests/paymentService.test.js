"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const paymentService_1 = require("../services/paymentService");
const Payment_1 = __importDefault(require("../models/Payment"));
const stripe_1 = __importDefault(require("stripe"));
jest.mock("../models/Payment");
jest.mock("stripe");
describe("PaymentService", () => {
    let paymentService;
    let mockStripe;
    beforeEach(() => {
        paymentService = new paymentService_1.PaymentService();
        mockStripe = {
            checkout: {
                sessions: {
                    create: jest.fn(),
                },
            },
        };
        stripe_1.default.mockReturnValue(mockStripe);
        jest.clearAllMocks();
    });
    describe("createPayment", () => {
        it("should create a new payment", async () => {
            const mockPaymentInfo = {
                id: "1",
                userId: "user1",
                orderId: "order1",
                stripePaymentId: "pi_123456",
                amount: 100,
                status: "completed",
                createdAt: new Date().toISOString(),
            };
            Payment_1.default.create.mockResolvedValue(mockPaymentInfo);
            const result = await paymentService.createPayment(mockPaymentInfo);
            expect(Payment_1.default.create).toHaveBeenCalledWith(mockPaymentInfo);
            expect(result).toEqual(mockPaymentInfo);
        });
    });
    describe("getAllPayments", () => {
        it("should return all payments", async () => {
            const mockPayments = [
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
            Payment_1.default.findAll.mockResolvedValue(mockPayments.map((payment) => ({
                toJSON: () => payment,
            })));
            const result = await paymentService.getAllPayments();
            expect(Payment_1.default.findAll).toHaveBeenCalled();
            expect(result).toEqual(mockPayments);
        });
        it("should handle errors when fetching payments", async () => {
            const mockError = new Error("Database error");
            Payment_1.default.findAll.mockRejectedValue(mockError);
            await expect(paymentService.getAllPayments()).rejects.toThrow("Database error");
        });
    });
});
