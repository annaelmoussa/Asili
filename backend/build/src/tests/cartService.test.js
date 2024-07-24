"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const cartService_1 = require("../services/cartService");
const Cart_1 = __importDefault(require("../models/Cart"));
const CartItem_1 = __importDefault(require("../models/CartItem"));
const Product_1 = __importDefault(require("../models/Product"));
const User_1 = __importDefault(require("../models/User"));
const sequelize_1 = require("sequelize");
const queues_1 = require("../queues");
jest.mock("../models/Cart");
jest.mock("../models/CartItem");
jest.mock("../models/Product");
jest.mock("../models/User");
jest.mock("../queues");
jest.mock("../models", () => ({
    sequelize: {
        transaction: jest.fn((callback) => callback()),
    },
}));
describe("CartService", () => {
    let cartService;
    beforeEach(() => {
        jest.clearAllMocks();
        cartService = new cartService_1.CartService();
    });
    describe("getCartIdByUserId", () => {
        it("should return cart id for a given user id", async () => {
            const userId = (0, uuid_1.v4)();
            const cartId = (0, uuid_1.v4)();
            Cart_1.default.findOne.mockResolvedValue({ id: cartId });
            const result = await cartService.getCartIdByUserId(userId);
            expect(Cart_1.default.findOne).toHaveBeenCalledWith({
                where: { userId },
                attributes: ["id"],
            });
            expect(result).toBe(cartId);
        });
    });
    describe("getCartItems", () => {
        it("should return cart items for a given cart id", async () => {
            const cartId = (0, uuid_1.v4)();
            const mockItems = [
                { id: (0, uuid_1.v4)(), productId: (0, uuid_1.v4)(), quantity: 2 },
                { id: (0, uuid_1.v4)(), productId: (0, uuid_1.v4)(), quantity: 1 },
            ];
            CartItem_1.default.findAll.mockResolvedValue(mockItems);
            const result = await cartService.getCartItems(cartId);
            expect(CartItem_1.default.findAll).toHaveBeenCalledWith(expect.objectContaining({
                where: {
                    cartId,
                    [sequelize_1.Op.or]: [
                        { reservationExpires: null },
                        { reservationExpires: { [sequelize_1.Op.gt]: expect.any(Date) } },
                    ],
                },
            }));
            expect(result).toEqual(mockItems);
        });
    });
    describe("addItem", () => {
        it("should add an item to the cart", async () => {
            const userId = (0, uuid_1.v4)();
            const productId = (0, uuid_1.v4)();
            const quantity = 2;
            const mockUser = { id: userId };
            const mockProduct = {
                id: productId,
                stock: 5,
                save: jest.fn().mockResolvedValue(true),
            };
            const mockCart = { id: (0, uuid_1.v4)() };
            const mockCartItem = {
                id: (0, uuid_1.v4)(),
                quantity: 2,
                save: jest.fn().mockResolvedValue(true),
            };
            User_1.default.findByPk.mockResolvedValue(mockUser);
            Product_1.default.findByPk.mockResolvedValue(mockProduct);
            Cart_1.default.findOrCreate.mockResolvedValue([mockCart]);
            CartItem_1.default.findOrCreate.mockResolvedValue([
                mockCartItem,
                true,
            ]);
            const result = await cartService.addItem(userId, productId, quantity);
            expect(User_1.default.findByPk).toHaveBeenCalledWith(userId, expect.any(Object));
            expect(Product_1.default.findByPk).toHaveBeenCalledWith(productId, expect.any(Object));
            expect(Cart_1.default.findOrCreate).toHaveBeenCalledWith(expect.any(Object));
            expect(CartItem_1.default.findOrCreate).toHaveBeenCalledWith(expect.any(Object));
            expect(mockProduct.save).toHaveBeenCalled();
            expect(mockCartItem.save).toHaveBeenCalled();
            expect(queues_1.reservationExpirationQueue.add).toHaveBeenCalled();
            expect(result).toEqual(mockCartItem);
        });
    });
    describe("removeItem", () => {
        it("should remove an item from the cart", async () => {
            const itemId = (0, uuid_1.v4)();
            const mockItem = {
                id: itemId,
                productId: (0, uuid_1.v4)(),
                quantity: 2,
                destroy: jest.fn().mockResolvedValue(true),
            };
            const mockProduct = { id: mockItem.productId };
            CartItem_1.default.findByPk.mockResolvedValue(mockItem);
            Product_1.default.findByPk.mockResolvedValue(mockProduct);
            await cartService.removeItem(itemId);
            expect(CartItem_1.default.findByPk).toHaveBeenCalledWith(itemId, expect.any(Object));
            expect(Product_1.default.findByPk).toHaveBeenCalledWith(mockItem.productId, expect.any(Object));
            expect(mockItem.destroy).toHaveBeenCalled();
            expect(queues_1.reservationExpirationQueue.removeJobs).toHaveBeenCalledWith(itemId);
            expect(queues_1.stockReleaseQueue.add).toHaveBeenCalled();
        });
    });
    describe("updateItemQuantity", () => {
        it("should update the quantity of an item in the cart", async () => {
            const itemId = (0, uuid_1.v4)();
            const newQuantity = 3;
            const mockItem = {
                id: itemId,
                productId: (0, uuid_1.v4)(),
                quantity: 2,
                save: jest.fn().mockResolvedValue(true),
            };
            const mockProduct = {
                id: mockItem.productId,
                stock: 5,
                save: jest.fn().mockResolvedValue(true),
            };
            CartItem_1.default.findByPk.mockResolvedValue(mockItem);
            Product_1.default.findByPk.mockResolvedValue(mockProduct);
            const result = await cartService.updateItemQuantity(itemId, newQuantity);
            expect(CartItem_1.default.findByPk).toHaveBeenCalledWith(itemId, expect.any(Object));
            expect(Product_1.default.findByPk).toHaveBeenCalledWith(mockItem.productId, expect.any(Object));
            expect(mockProduct.save).toHaveBeenCalled();
            expect(mockItem.save).toHaveBeenCalled();
            expect(queues_1.reservationExpirationQueue.removeJobs).toHaveBeenCalledWith(itemId);
            expect(queues_1.reservationExpirationQueue.add).toHaveBeenCalled();
            expect(result).toEqual(expect.objectContaining({ quantity: newQuantity }));
        });
    });
    describe("clearExpiredReservations", () => {
        it("should clear expired reservations", async () => {
            const mockExpiredItems = [
                {
                    id: (0, uuid_1.v4)(),
                    productId: (0, uuid_1.v4)(),
                    quantity: 2,
                    destroy: jest.fn().mockResolvedValue(true),
                },
                {
                    id: (0, uuid_1.v4)(),
                    productId: (0, uuid_1.v4)(),
                    quantity: 1,
                    destroy: jest.fn().mockResolvedValue(true),
                },
            ];
            CartItem_1.default.findAll.mockResolvedValue(mockExpiredItems);
            Product_1.default.findByPk.mockResolvedValue({
                stock: 0,
                save: jest.fn().mockResolvedValue(true),
            });
            await cartService.clearExpiredReservations();
            expect(CartItem_1.default.findAll).toHaveBeenCalled();
            expect(Product_1.default.findByPk).toHaveBeenCalledTimes(mockExpiredItems.length);
            mockExpiredItems.forEach((item) => {
                expect(item.destroy).toHaveBeenCalled();
            });
        });
    });
    describe("getCartItemById", () => {
        it("should return a cart item by its id", async () => {
            const itemId = (0, uuid_1.v4)();
            const mockItem = { id: itemId, productId: (0, uuid_1.v4)(), quantity: 2 };
            CartItem_1.default.findByPk.mockResolvedValue(mockItem);
            const result = await cartService.getCartItemById(itemId);
            expect(CartItem_1.default.findByPk).toHaveBeenCalledWith(itemId, expect.any(Object));
            expect(result).toEqual(mockItem);
        });
    });
    describe("clearCart", () => {
        it("should clear all items from a user's cart", async () => {
            const userId = (0, uuid_1.v4)();
            const cartId = (0, uuid_1.v4)();
            Cart_1.default.findOne.mockResolvedValue({ id: cartId });
            await cartService.clearCart(userId);
            expect(Cart_1.default.findOne).toHaveBeenCalledWith({
                where: { userId },
                attributes: ["id"],
            });
            expect(CartItem_1.default.destroy).toHaveBeenCalledWith({
                where: { cartId },
            });
        });
        it("should throw an error if cart is not found", async () => {
            const userId = (0, uuid_1.v4)();
            Cart_1.default.findOne.mockResolvedValue(null);
            await expect(cartService.clearCart(userId)).rejects.toThrow("Cart not found");
        });
    });
});
