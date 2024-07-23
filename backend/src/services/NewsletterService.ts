import NewsletterSubscription from "../models/NewsletterSubscription";
import User from "../models/User";
import AlertPreference from "../models/AlertPreference";
import sendEmail from "./emailService";

export class NewsletterService {
  public async sendNewsletter(subject: string, content: string): Promise<void> {
    const subscribers = await NewsletterSubscription.findAll({
      where: { isSubscribed: true },
    });

    for (const subscriber of subscribers) {
      await sendEmail(subscriber.email, subject, content);
    }
  }

  public async subscribeToNewsletter(email: string, userId?: string): Promise<void> {
    const [subscription, created] = await NewsletterSubscription.findOrCreate({
      where: { email },
      defaults: { userId, isSubscribed: true },
    });
  
    if (!created && !subscription.isSubscribed) {
      await subscription.update({ isSubscribed: true });
    }
  
    if (userId) {
      await AlertPreference.update(
        { newsletter: true },
        { where: { userId }, 
        }
      );
    }
  }

  public async unsubscribeFromNewsletter(email: string): Promise<void> {
    await NewsletterSubscription.update(
      { isSubscribed: false },
      { where: { email } }
    );
  }

  public async getSubscriptionStatus(userId: string): Promise<{ isSubscribed: boolean }> {
    const subscription = await NewsletterSubscription.findOne({
      where: { userId },
    });
    return { isSubscribed: subscription?.isSubscribed || false };
  }
}