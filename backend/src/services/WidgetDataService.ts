import { IWidget } from "@/interfaces/IWidget";
import { Sequelize } from "sequelize-typescript";
import ProductMongo from "../models/ProductMongo";
import { MongoOrder } from "../models/MongoOrder";
import User from "../models/User";

export class WidgetDataService {
  public async getDataForWidget(widget: IWidget): Promise<any> {
    return this.getDataForModelType(widget.modelType);
  }

  public async getDataForModelType(modelType: string): Promise<any> {
    switch (modelType) {
      case "Products":
        return this.getProductData();
      case "Users":
        return this.getUserData();
      case "Orders":
        return this.getOrderData();
      default:
        throw new Error(`Unsupported model type: ${modelType}`);
    }
  }

  private async getProductData(): Promise<any> {
    const [priceDistribution, stockLevels] = await Promise.all([
      ProductMongo.aggregate([
        {
          $group: {
            _id: { $round: ["$price", -1] },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      ProductMongo.aggregate([
        {
          $group: {
            _id: "$stock",
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    return { priceDistribution, stockLevels };
  }

  private async getUserData(): Promise<any> {
    const [roleDistribution, confirmationStatus] = await Promise.all([
      User.findAll({
        attributes: [
          "role",
          [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
        ],
        group: ["role"],
        raw: true,
      }),
      User.findAll({
        attributes: [
          "isConfirmed",
          [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
        ],
        group: ["isConfirmed"],
        raw: true,
      }),
    ]);

    return { roleDistribution, confirmationStatus };
  }

  private async getOrderData(): Promise<any> {
    const [orderStatusDistribution, revenueOverTime] = await Promise.all([
      MongoOrder.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
      MongoOrder.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            totalRevenue: { $sum: "$amount" },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    return { orderStatusDistribution, revenueOverTime };
  }
}
