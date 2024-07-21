"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const sequelize_typescript_1 = require("sequelize-typescript");
const User_1 = __importDefault(require("./User"));
const Cart_1 = __importDefault(require("./Cart"));
const Product_1 = __importDefault(require("./Product"));
const CartItem_1 = __importDefault(require("./CartItem"));
const TokenBlacklist_1 = __importDefault(require("./TokenBlacklist"));
const Widget_1 = __importDefault(require("./Widget"));
const Brand_1 = __importDefault(require("./Brand"));
const Category_1 = __importDefault(require("./Category"));
const EmailNotification_1 = __importDefault(require("./EmailNotification"));
const UserPreferences_1 = __importDefault(require("./UserPreferences"));
const Invoice_1 = __importDefault(require("./Invoice"));
const Payment_1 = __importDefault(require("./Payment"));
const SentEmail_1 = __importDefault(require("./SentEmail"));
const env = process.env.NODE_ENV || "development";
const config = require("../config/config.js")[env];
const sequelize = new sequelize_typescript_1.Sequelize({
    ...config,
    models: [
        User_1.default,
        Cart_1.default,
        Product_1.default,
        CartItem_1.default,
        TokenBlacklist_1.default,
        Widget_1.default,
        Brand_1.default,
        Category_1.default,
        EmailNotification_1.default,
        UserPreferences_1.default,
        Invoice_1.default,
        Payment_1.default,
        SentEmail_1.default,
    ],
});
const db = {
    sequelize,
    Sequelize: sequelize_typescript_1.Sequelize,
    User: User_1.default,
    Cart: Cart_1.default,
    Product: Product_1.default,
    CartItem: CartItem_1.default,
    TokenBlacklist: TokenBlacklist_1.default,
    Widget: Widget_1.default,
    Brand: Brand_1.default,
    Category: Category_1.default,
    EmailNotification: EmailNotification_1.default,
    UserPreferences: UserPreferences_1.default,
    Invoice: Invoice_1.default,
    Payment: Payment_1.default,
    SentEmail: SentEmail_1.default,
};
module.exports = db;
