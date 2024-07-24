"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertService = void 0;
const AlertPreference_1 = __importDefault(require("../models/AlertPreference"));
const User_1 = __importDefault(require("../models/User"));
const emailService_1 = __importDefault(require("./emailService"));
const ProductSubscription_1 = __importDefault(require("../models/ProductSubscription"));
const Category_1 = __importDefault(require("../models/Category"));
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
        const subscriptions = await ProductSubscription_1.default.findAll({
            where: {
                productId: product.id,
                notifyRestock: true,
            },
            include: [
                {
                    model: User_1.default,
                    include: [
                        {
                            model: AlertPreference_1.default,
                            where: { productRestock: true },
                        },
                    ],
                },
            ],
        });
        for (const subscription of subscriptions) {
            if (subscription.user && subscription.user.alertPreferences) {
                await (0, emailService_1.default)(subscription.user.email, "Product Restock Alert", `The product "${product.name}" is back in stock!`);
            }
        }
    }
    async sendPriceChangeAlert(product, oldPrice) {
        const subscriptions = await ProductSubscription_1.default.findAll({
            where: {
                productId: product.id,
                notifyPriceChange: true,
            },
            include: [
                {
                    model: User_1.default,
                    include: [
                        {
                            model: AlertPreference_1.default,
                            where: { priceChange: true },
                        },
                    ],
                },
            ],
        });
        for (const subscription of subscriptions) {
            if (subscription.user && subscription.user.alertPreferences) {
                await (0, emailService_1.default)(subscription.user.email, "Price Change Alert", `The price of "${product.name}" has changed from ${oldPrice}€ to ${product.price}€.`);
            }
        }
    }
    async sendNewProductInCategoryAlert(product) {
        const category = await Category_1.default.findByPk(product.categoryId);
        if (!category)
            return;
        const subscriptions = await ProductSubscription_1.default.findAll({
            where: {
                categoryId: product.categoryId,
                notifyNewProductInCategory: true,
            },
            include: [
                {
                    model: User_1.default,
                    include: [
                        {
                            model: AlertPreference_1.default,
                            where: { newProductInCategory: true },
                        },
                    ],
                },
            ],
        });
        for (const subscription of subscriptions) {
            if (subscription.user && subscription.user.alertPreferences) {
                await (0, emailService_1.default)(subscription.user.email, "New Product in Category Alert", `A new product "${product.name}" has been added to the ${category.name} category.`);
            }
        }
    }
    async sendNewsletter(subject, content) {
        const subscribedUsers = await User_1.default.findAll({
            include: [{
                    model: AlertPreference_1.default,
                    where: { newsletter: true },
                    required: true
                }]
        });
        for (const user of subscribedUsers) {
            await (0, emailService_1.default)(user.email, subject, content);
        }
    }
}
exports.AlertService = AlertService;
