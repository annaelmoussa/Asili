"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetDataService = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const ProductMongo_1 = __importDefault(require("../models/ProductMongo"));
const MongoOrder_1 = require("../models/MongoOrder");
const User_1 = __importDefault(require("../models/User"));
class WidgetDataService {
    async getDataForWidget(widget) {
        return this.getDataForModelType(widget.modelType);
    }
    async getDataForModelType(modelType) {
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
    async getProductData() {
        const [priceDistribution, stockLevels] = await Promise.all([
            ProductMongo_1.default.aggregate([
                {
                    $group: {
                        _id: { $round: ["$price", -1] },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { _id: 1 } },
            ]),
            ProductMongo_1.default.aggregate([
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
    async getUserData() {
        const [roleDistribution, confirmationStatus] = await Promise.all([
            User_1.default.findAll({
                attributes: [
                    "role",
                    [sequelize_typescript_1.Sequelize.fn("COUNT", sequelize_typescript_1.Sequelize.col("id")), "count"],
                ],
                group: ["role"],
                raw: true,
            }),
            User_1.default.findAll({
                attributes: [
                    "isConfirmed",
                    [sequelize_typescript_1.Sequelize.fn("COUNT", sequelize_typescript_1.Sequelize.col("id")), "count"],
                ],
                group: ["isConfirmed"],
                raw: true,
            }),
        ]);
        return { roleDistribution, confirmationStatus };
    }
    async getOrderData() {
        const [orderStatusDistribution, revenueOverTime] = await Promise.all([
            MongoOrder_1.MongoOrder.aggregate([
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 },
                    },
                },
            ]),
            MongoOrder_1.MongoOrder.aggregate([
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
exports.WidgetDataService = WidgetDataService;
