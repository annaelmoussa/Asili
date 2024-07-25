"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterService = void 0;
const NewsletterSubscription_1 = __importDefault(require("../models/NewsletterSubscription"));
const AlertPreference_1 = __importDefault(require("../models/AlertPreference"));
const emailService_1 = __importDefault(require("./emailService"));
class NewsletterService {
    async sendNewsletter(subject, content) {
        const subscribers = await NewsletterSubscription_1.default.findAll({
            where: { isSubscribed: true },
        });
        for (const subscriber of subscribers) {
            await (0, emailService_1.default)(subscriber.email, subject, content);
        }
    }
    async subscribeToNewsletter(email, userId) {
        const [subscription, created] = await NewsletterSubscription_1.default.findOrCreate({
            where: { email },
            defaults: { userId, isSubscribed: true },
        });
        if (!created && !subscription.isSubscribed) {
            await subscription.update({ isSubscribed: true });
        }
        if (userId) {
            await AlertPreference_1.default.update({ newsletter: true }, { where: { userId },
            });
        }
    }
    async unsubscribeFromNewsletter(email) {
        await NewsletterSubscription_1.default.update({ isSubscribed: false }, { where: { email } });
    }
    async getSubscriptionStatus(userId) {
        const subscription = await NewsletterSubscription_1.default.findOne({
            where: { userId },
        });
        return { isSubscribed: subscription?.isSubscribed || false };
    }
}
exports.NewsletterService = NewsletterService;