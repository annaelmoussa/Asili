import AlertPreference from "../models/AlertPreference";
import User from "../models/User";
import Product from "../models/Product";
import sendEmail from "./emailService";

export class AlertService {
  public async createAlertPreference(userId: string): Promise<AlertPreference> {
    return AlertPreference.create({ userId });
  }

  public async updateAlertPreference(userId: string, preferences: Partial<AlertPreference>): Promise<AlertPreference | null> {
    console.log("jason",JSON.stringify(preferences));
    const alertPreference = await AlertPreference.findOne({ where: { userId } });
    if (alertPreference) {
      
      return alertPreference.update(preferences);
    }
    
    return null;
  }

  public async getAlertPreference(userId: string): Promise<AlertPreference | null> {
    return AlertPreference.findOne({ where: { userId } });
  }

  public async sendNewProductAlert(product: Product): Promise<void> {
    const users = await User.findAll({
      include: [{
        model: AlertPreference,
        as: 'alertPreferences',
        where: { newProductInCategory: true },
      }],
    });

    for (const user of users) {
      await sendEmail(
        user.email,
        "New Product Alert",
        `A new product "${product.name}" has been added to the ${product.category} category.`
      );
    }
  }

  public async sendRestockAlert(product: Product): Promise<void> {
    const users = await User.findAll({
      include: [{
        model: AlertPreference,
        as: 'alertPreferences',
        where: { productRestock: true },
      }],
    });

    for (const user of users) {
      await sendEmail(
        user.email,
        "Product Restock Alert",
        `The product "${product.name}" is back in stock!`
      );
    }
  }

  public async sendPriceChangeAlert(product: Product, oldPrice: number): Promise<void> {
    const users = await User.findAll({
      include: [{
        model: AlertPreference,
        as: 'alertPreferences',
        where: { priceChange: true },
      }],
    });

    for (const user of users) {
      await sendEmail(
        user.email,
        "Price Change Alert",
        `The price of "${product.name}" has changed from $${oldPrice} to $${product.price}.`
      );
    }
  }

  public async sendNewsletterAlert(newsletter: string): Promise<void> {
    const users = await User.findAll({
      include: [{
        model: AlertPreference,
        as: 'alertPreferences',
        where: { newsletter: true },
      }],
    });

    for (const user of users) {
      await sendEmail(
        user.email,
        "Newsletter",
        newsletter
      );
    }
  }
}