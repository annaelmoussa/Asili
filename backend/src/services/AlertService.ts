import AlertPreference from "../models/AlertPreference";
import User from "../models/User";
import Product from "../models/Product";
import sendEmail from "./emailService";
import { IAlertPreference } from "../interfaces/IAlertPreference";
import ProductSubscription from "../models/ProductSubscription";
import Category  from "../models/Category";
import { IProduct } from "../interfaces/IProduct";

export class AlertService {
  public async createAlertPreference(userId: string): Promise<AlertPreference> {
    return AlertPreference.create({
      userId,
      newProductInCategory: false,
      productRestock: false,
      priceChange: false,
      newsletter: false,
    } as IAlertPreference);
  }

  public async updateAlertPreference(
    userId: string,
    preferences: Partial<IAlertPreference>
  ): Promise<AlertPreference | null> {
    const alertPreference = await AlertPreference.findOne({
      where: { userId },
    });
    if (alertPreference) {
      return alertPreference.update(preferences);
    }
    return null;
  }

  public async getAlertPreference(
    userId: string
  ): Promise<AlertPreference | null> {
    return AlertPreference.findOne({ where: { userId } });
  }

  public async sendNewProductAlert(product: Product): Promise<void> {
    const users = await User.findAll({
      include: [
        {
          model: AlertPreference,
          as: "alertPreferences",
          where: { newProductInCategory: true },
        },
      ],
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
    const subscriptions = await ProductSubscription.findAll({
      where: {
        productId: product.id,
        notifyRestock: true,
      },
      include: [
        {
          model: User,
          include: [
            {
              model: AlertPreference,
              where: { productRestock: true },
            },
          ],
        },
      ],
    });

    for (const subscription of subscriptions) {
      if (subscription.user && subscription.user.alertPreferences) {
        await sendEmail(
          subscription.user.email,
          "Product Restock Alert",
          `The product "${product.name}" is back in stock!`
        );
      }
    }
  }

  public async sendPriceChangeAlert(
    product: Product,
    oldPrice: number
  ): Promise<void> {
    const subscriptions = await ProductSubscription.findAll({
      where: {
        productId: product.id,
        notifyPriceChange: true,
      },
      include: [
        {
          model: User,
          include: [
            {
              model: AlertPreference,
              where: { priceChange: true },
            },
          ],
        },
      ],
    });
    
    for (const subscription of subscriptions) {
      if (subscription.user && subscription.user.alertPreferences) {
        await sendEmail(
          subscription.user.email,
          "Price Change Alert",
          `The price of "${product.name}" has changed from $${oldPrice} to $${product.price}.`
        );
      }
    }
  }

  public async sendNewProductInCategoryAlert(product: IProduct): Promise<void> {
    const category = await Category.findByPk(product.categoryId);
    if (!category) return;

    const subscriptions = await ProductSubscription.findAll({
      where: {
        categoryId: product.categoryId,
        notifyNewProductInCategory: true,
      },
      include: [
        {
          model: User,
          include: [
            {
              model: AlertPreference,
              where: { newProductInCategory: true },
            },
          ],
        },
      ],
    });

    for (const subscription of subscriptions) {
      if (subscription.user && subscription.user.alertPreferences) {
        await sendEmail(
          subscription.user.email,
          "New Product in Category Alert",
          `A new product "${product.name}" has been added to the ${category.name} category.`
        );
      }
    }
  }

  public async sendNewsletter(subject: string, content: string): Promise<void> {
    const subscribedUsers = await User.findAll({
      include: [{
        model: AlertPreference,
        where: { newsletter: true },
        required: true
      }]
    });

    for (const user of subscribedUsers) {
      await sendEmail(user.email, subject, content);
    }
  }
}
