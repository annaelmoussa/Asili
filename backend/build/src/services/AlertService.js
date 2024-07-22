"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertService = void 0;
const AlertPreference_1 = __importDefault(require("../models/AlertPreference"));
const User_1 = __importDefault(require("../models/User"));
const emailService_1 = __importDefault(require("./emailService"));
class AlertService {
    async createAlertPreference(userId) {
        return AlertPreference_1.default.create({
            userId,
            newProductInCategory: false,
            productRestock: false,
            priceChange: false,
            newsletter: false,
        });
    }
    async updateAlertPreference(userId, preferences) {
        const alertPreference = await AlertPreference_1.default.findOne({
            where: { userId },
        });
        if (alertPreference) {
            return alertPreference.update(preferences);
        }
        return null;
    }
    async getAlertPreference(userId) {
        return AlertPreference_1.default.findOne({ where: { userId } });
    }
    async sendNewProductAlert(product) {
        const users = await User_1.default.findAll({
            include: [
                {
                    model: AlertPreference_1.default,
                    as: "alertPreferences",
                    where: { newProductInCategory: true },
                },
            ],
        });
        for (const user of users) {
            await (0, emailService_1.default)(user.email, "New Product Alert", `A new product "${product.name}" has been added to the ${product.category} category.`);
        }
    }
    async sendRestockAlert(product) {
        const users = await User_1.default.findAll({
            include: [
                {
                    model: AlertPreference_1.default,
                    as: "alertPreferences",
                    where: { productRestock: true },
                },
            ],
        });
        for (const user of users) {
            await (0, emailService_1.default)(user.email, "Product Restock Alert", `The product "${product.name}" is back in stock!`);
        }
    }
    async sendPriceChangeAlert(product, oldPrice) {
        const users = await User_1.default.findAll({
            include: [
                {
                    model: AlertPreference_1.default,
                    as: "alertPreferences",
                    where: { priceChange: true },
                },
            ],
        });
        for (const user of users) {
            await (0, emailService_1.default)(user.email, "Price Change Alert", `The price of "${product.name}" has changed from $${oldPrice} to $${product.price}.`);
        }
    }
    async sendNewsletterAlert(newsletter) {
        const users = await User_1.default.findAll({
            include: [
                {
                    model: AlertPreference_1.default,
                    as: "alertPreferences",
                    where: { newsletter: true },
                },
            ],
        });
        for (const user of users) {
            await (0, emailService_1.default)(user.email, "Newsletter", newsletter);
        }
    }
}
exports.AlertService = AlertService;
