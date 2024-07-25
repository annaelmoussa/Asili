"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const CartItem_1 = __importDefault(require("../models/CartItem"));
const Product_1 = __importDefault(require("../models/Product"));
const models_1 = __importDefault(require("../models"));
index_1.reservationExpirationQueue.process(async (job) => {
    const { cartItemId, quantity } = job.data;
    await models_1.default.sequelize.transaction(async (t) => {
        const cartItem = await CartItem_1.default.findByPk(cartItemId, {
            transaction: t,
            include: [{ model: Product_1.default }],
        });
        if (cartItem) {
            const product = await Product_1.default.findByPk(cartItem.productId, {
                transaction: t,
                lock: true,
            });
            if (product) {
                product.stock += quantity;
                await product.save({ transaction: t });
            }
            await cartItem.destroy({ transaction: t });
        }
    });
});
index_1.stockReleaseQueue.process(async (job) => {
    const { productId, quantity } = job.data;
    await models_1.default.sequelize.transaction(async (t) => {
        const product = await Product_1.default.findByPk(productId, {
            transaction: t,
            lock: true,
        });
        if (product) {
            product.stock += quantity;
            await product.save({ transaction: t });
        }
    });
});
