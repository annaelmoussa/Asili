"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NewsletterService_1 = require("../services/NewsletterService");
const NewsletterSubscription_1 = __importDefault(require("../models/NewsletterSubscription"));
const AlertPreference_1 = __importDefault(require("../models/AlertPreference"));
const emailService_1 = __importDefault(require("../services/emailService"));
jest.mock("../models/NewsletterSubscription");
jest.mock("../models/AlertPreference");
jest.mock("../services/emailService");
describe("NewsletterService", () => {
    let newsletterService;
    beforeEach(() => {
        newsletterService = new NewsletterService_1.NewsletterService();
        jest.clearAllMocks();
    });
    describe("sendNewsletter", () => {
        it("should send newsletter to all subscribed users", async () => {
            const mockSubscribers = [
                { email: "user1@example.com", isSubscribed: true },
                { email: "user2@example.com", isSubscribed: true },
            ];
            NewsletterSubscription_1.default.findAll.mockResolvedValue(mockSubscribers);
            await newsletterService.sendNewsletter("Test Subject", "Test Content");
            expect(NewsletterSubscription_1.default.findAll).toHaveBeenCalledWith({
                where: { isSubscribed: true },
            });
            expect(emailService_1.default).toHaveBeenCalledTimes(2);
            expect(emailService_1.default).toHaveBeenCalledWith("user1@example.com", "Test Subject", "Test Content");
            expect(emailService_1.default).toHaveBeenCalledWith("user2@example.com", "Test Subject", "Test Content");
        });
    });
    describe("subscribeToNewsletter", () => {
        it("should create a new subscription if not exists", async () => {
            const email = "newuser@example.com";
            const userId = "user123";
            NewsletterSubscription_1.default.findOrCreate.mockResolvedValue([
                { email, userId, isSubscribed: true },
                true,
            ]);
            await newsletterService.subscribeToNewsletter(email, userId);
            expect(NewsletterSubscription_1.default.findOrCreate).toHaveBeenCalledWith({
                where: { email },
                defaults: { userId, isSubscribed: true },
            });
            expect(AlertPreference_1.default.update).toHaveBeenCalledWith({ newsletter: true }, { where: { userId } });
        });
        it("should update existing subscription if not subscribed", async () => {
            const email = "existinguser@example.com";
            const mockSubscription = {
                email,
                isSubscribed: false,
                update: jest.fn(),
            };
            NewsletterSubscription_1.default.findOrCreate.mockResolvedValue([
                mockSubscription,
                false,
            ]);
            await newsletterService.subscribeToNewsletter(email);
            expect(mockSubscription.update).toHaveBeenCalledWith({
                isSubscribed: true,
            });
            expect(AlertPreference_1.default.update).not.toHaveBeenCalled();
        });
    });
    describe("unsubscribeFromNewsletter", () => {
        it("should update subscription status to false", async () => {
            const email = "user@example.com";
            await newsletterService.unsubscribeFromNewsletter(email);
            expect(NewsletterSubscription_1.default.update).toHaveBeenCalledWith({ isSubscribed: false }, { where: { email } });
        });
    });
    describe("getSubscriptionStatus", () => {
        it("should return true if user is subscribed", async () => {
            const userId = "user123";
            NewsletterSubscription_1.default.findOne.mockResolvedValue({
                isSubscribed: true,
            });
            const result = await newsletterService.getSubscriptionStatus(userId);
            expect(NewsletterSubscription_1.default.findOne).toHaveBeenCalledWith({
                where: { userId },
            });
            expect(result).toEqual({ isSubscribed: true });
        });
        it("should return false if user is not subscribed", async () => {
            const userId = "user456";
            NewsletterSubscription_1.default.findOne.mockResolvedValue(null);
            const result = await newsletterService.getSubscriptionStatus(userId);
            expect(NewsletterSubscription_1.default.findOne).toHaveBeenCalledWith({
                where: { userId },
            });
            expect(result).toEqual({ isSubscribed: false });
        });
    });
});
