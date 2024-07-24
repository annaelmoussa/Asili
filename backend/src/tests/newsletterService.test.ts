import { NewsletterService } from "../services/NewsletterService";
import NewsletterSubscription from "../models/NewsletterSubscription";
import AlertPreference from "../models/AlertPreference";
import sendEmail from "../services/emailService";

jest.mock("../models/NewsletterSubscription");
jest.mock("../models/AlertPreference");
jest.mock("../services/emailService");

describe("NewsletterService", () => {
  let newsletterService: NewsletterService;

  beforeEach(() => {
    newsletterService = new NewsletterService();
    jest.clearAllMocks();
  });

  describe("sendNewsletter", () => {
    it("should send newsletter to all subscribed users", async () => {
      const mockSubscribers = [
        { email: "user1@example.com", isSubscribed: true },
        { email: "user2@example.com", isSubscribed: true },
      ];
      (NewsletterSubscription.findAll as jest.Mock).mockResolvedValue(
        mockSubscribers
      );

      await newsletterService.sendNewsletter("Test Subject", "Test Content");

      expect(NewsletterSubscription.findAll).toHaveBeenCalledWith({
        where: { isSubscribed: true },
      });
      expect(sendEmail).toHaveBeenCalledTimes(2);
      expect(sendEmail).toHaveBeenCalledWith(
        "user1@example.com",
        "Test Subject",
        "Test Content"
      );
      expect(sendEmail).toHaveBeenCalledWith(
        "user2@example.com",
        "Test Subject",
        "Test Content"
      );
    });
  });

  describe("subscribeToNewsletter", () => {
    it("should create a new subscription if not exists", async () => {
      const email = "newuser@example.com";
      const userId = "user123";
      (NewsletterSubscription.findOrCreate as jest.Mock).mockResolvedValue([
        { email, userId, isSubscribed: true },
        true,
      ]);

      await newsletterService.subscribeToNewsletter(email, userId);

      expect(NewsletterSubscription.findOrCreate).toHaveBeenCalledWith({
        where: { email },
        defaults: { userId, isSubscribed: true },
      });
      expect(AlertPreference.update).toHaveBeenCalledWith(
        { newsletter: true },
        { where: { userId } }
      );
    });

    it("should update existing subscription if not subscribed", async () => {
      const email = "existinguser@example.com";
      const mockSubscription = {
        email,
        isSubscribed: false,
        update: jest.fn(),
      };
      (NewsletterSubscription.findOrCreate as jest.Mock).mockResolvedValue([
        mockSubscription,
        false,
      ]);

      await newsletterService.subscribeToNewsletter(email);

      expect(mockSubscription.update).toHaveBeenCalledWith({
        isSubscribed: true,
      });
      expect(AlertPreference.update).not.toHaveBeenCalled();
    });
  });

  describe("unsubscribeFromNewsletter", () => {
    it("should update subscription status to false", async () => {
      const email = "user@example.com";

      await newsletterService.unsubscribeFromNewsletter(email);

      expect(NewsletterSubscription.update).toHaveBeenCalledWith(
        { isSubscribed: false },
        { where: { email } }
      );
    });
  });

  describe("getSubscriptionStatus", () => {
    it("should return true if user is subscribed", async () => {
      const userId = "user123";
      (NewsletterSubscription.findOne as jest.Mock).mockResolvedValue({
        isSubscribed: true,
      });

      const result = await newsletterService.getSubscriptionStatus(userId);

      expect(NewsletterSubscription.findOne).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(result).toEqual({ isSubscribed: true });
    });

    it("should return false if user is not subscribed", async () => {
      const userId = "user456";
      (NewsletterSubscription.findOne as jest.Mock).mockResolvedValue(null);

      const result = await newsletterService.getSubscriptionStatus(userId);

      expect(NewsletterSubscription.findOne).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(result).toEqual({ isSubscribed: false });
    });
  });
});
