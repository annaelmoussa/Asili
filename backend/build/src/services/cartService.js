"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const Cart_1 = __importDefault(require("../models/Cart"));
const CartItem_1 = __importDefault(require("../models/CartItem"));
const Product_1 = __importDefault(require("../models/Product"));
const User_1 = __importDefault(require("../models/User"));
const sequelize_1 = require("sequelize");
const queues_1 = require("../queues");
const models_1 = __importDefault(require("../models"));
class CartService {
    constructor() {
        this.RESERVATION_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
    }
    async getCartIdByUserId(userId) {
        const cart = await Cart_1.default.findOne({
            where: { userId },
            attributes: ["id"],
        });
        return cart ? cart.id : null;
    }
    async getCartItems(cartId) {
        try {
            const items = await CartItem_1.default.findAll({
                where: {
                    cartId,
                    [sequelize_1.Op.or]: [
                        { reservationExpires: null },
                        { reservationExpires: { [sequelize_1.Op.gt]: new Date() } },
                    ],
                },
                include: [
                    {
                        model: Product_1.default,
                        as: "product",
                    },
                ],
            });
            console.log("Items fetched:", JSON.stringify(items, null, 2));
            return items;
        }
        catch (error) {
            console.error("Error fetching cart items:", error);
            throw error;
        }
    }
    async addItem(userId, productId, quantity) {
        return models_1.default.sequelize.transaction(async (t) => {
            const user = await User_1.default.findByPk(userId, { transaction: t });
            if (!user) {
                console.log("User not found for token 278:");
                throw new Error("User not found");
            }
            const product = await Product_1.default.findByPk(productId, {
                transaction: t,
                lock: true,
            });
            if (!product) {
                throw new Error("Product not found");
            }
            if (product.stock < quantity) {
                throw new Error("Not enough stock");
            }
            const [cart] = await Cart_1.default.findOrCreate({
                where: { userId },
                transaction: t,
            });
            const [item, created] = await CartItem_1.default.findOrCreate({
                where: { cartId: cart.id, productId },
                defaults: {
                    cartId: cart.id,
                    productId: productId,
                    quantity: 0,
                    reservationExpires: new Date(Date.now() + this.RESERVATION_DURATION),
                },
                transaction: t,
            });
            const newQuantity = item.quantity + quantity;
            const stockReduction = quantity; // Only reduce stock by the new quantity added
            product.stock -= stockReduction;
            await product.save({ transaction: t });
            item.quantity = newQuantity;
            item.reservationExpires = new Date(Date.now() + this.RESERVATION_DURATION);
            await item.save({ transaction: t });
            try {
                await queues_1.reservationExpirationQueue.add({ cartItemId: item.id, quantity: stockReduction }, { delay: this.RESERVATION_DURATION });
            }
            catch (error) {
                console.error("Failed to add reservation expiration job:", error);
            }
            return item;
        });
    }
    async removeItem(itemId) {
        return models_1.default.sequelize.transaction(async (t) => {
            const item = await CartItem_1.default.findByPk(itemId, {
                transaction: t,
                include: [{ model: Product_1.default }],
            });
            if (!item) {
                throw new Error("Item not found");
            }
            const product = await Product_1.default.findByPk(item.productId, {
                transaction: t,
                lock: true,
            });
            if (!product) {
                throw new Error("Product not found");
            }
            // We don't modify the stock here, as it will be handled by the stockReleaseQueue
            await item.destroy({ transaction: t });
            try {
                await queues_1.reservationExpirationQueue.removeJobs(itemId);
                await queues_1.stockReleaseQueue.add({
                    productId: item.productId,
                    quantity: item.quantity,
                });
            }
            catch (error) {
                console.error("Failed to manage queue jobs:", error);
            }
        });
    }
    async updateItemQuantity(itemId, newQuantity) {
        return models_1.default.sequelize.transaction(async (t) => {
            const item = await CartItem_1.default.findByPk(itemId, {
                transaction: t,
                include: [{ model: Product_1.default }],
            });
            if (!item) {
                throw new Error("Item not found");
            }
            const product = await Product_1.default.findByPk(item.productId, {
                transaction: t,
                lock: true,
            });
            if (!product) {
                throw new Error("Product not found");
            }
            const quantityDiff = newQuantity - item.quantity;
            if (product.stock < quantityDiff) {
                throw new Error("Not enough stock");
            }
            product.stock -= quantityDiff;
            await product.save({ transaction: t });
            item.quantity = newQuantity;
            item.reservationExpires = new Date(Date.now() + this.RESERVATION_DURATION);
            await item.save({ transaction: t });
            try {
                await queues_1.reservationExpirationQueue.removeJobs(itemId);
                await queues_1.reservationExpirationQueue.add({ cartItemId: itemId, quantity: newQuantity }, { delay: this.RESERVATION_DURATION });
            }
            catch (error) {
                console.error("Failed to manage queue jobs:", error);
            }
            return item;
        });
    }
    async clearExpiredReservations() {
        const expiredItems = await CartItem_1.default.findAll({
            where: {
                reservationExpires: {
                    [sequelize_1.Op.lt]: new Date(),
                },
            },
            include: [{ model: Product_1.default }],
        });
        for (const item of expiredItems) {
            await models_1.default.sequelize.transaction(async (t) => {
                const product = await Product_1.default.findByPk(item.productId, {
                    transaction: t,
                    lock: true,
                });
                if (product) {
                    product.stock += item.quantity;
                    await product.save({ transaction: t });
                }
                await item.destroy({ transaction: t });
            });
        }
    }
    async getCartItemById(itemId) {
        return CartItem_1.default.findByPk(itemId, {
            include: [
                {
                    model: Cart_1.default,
                    as: "cart",
                    attributes: ["userId"],
                },
            ],
        });
    }
    async clearCart(userId) {
        const cartId = await this.getCartIdByUserId(userId);
        if (!cartId) {
            throw new Error("Cart not found");
        }
        await CartItem_1.default.destroy({
            where: { cartId }
        });
    }
}
exports.CartService = CartService;
