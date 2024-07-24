import { v4 as uuidv4 } from "uuid";
import { CartService } from "../services/cartService";
import Cart from "../models/Cart";
import CartItem from "../models/CartItem";
import Product from "../models/Product";
import User from "../models/User";
import { Op } from "sequelize";
import { reservationExpirationQueue, stockReleaseQueue } from "../queues";
import db from "../models";

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
  let cartService: CartService;

  beforeEach(() => {
    jest.clearAllMocks();
    cartService = new CartService();
  });

  describe("getCartIdByUserId", () => {
    it("should return cart id for a given user id", async () => {
      const userId = uuidv4();
      const cartId = uuidv4();
      (Cart.findOne as jest.Mock).mockResolvedValue({ id: cartId });

      const result = await cartService.getCartIdByUserId(userId);

      expect(Cart.findOne).toHaveBeenCalledWith({
        where: { userId },
        attributes: ["id"],
      });
      expect(result).toBe(cartId);
    });
  });

  describe("getCartItems", () => {
    it("should return cart items for a given cart id", async () => {
      const cartId = uuidv4();
      const mockItems = [
        { id: uuidv4(), productId: uuidv4(), quantity: 2 },
        { id: uuidv4(), productId: uuidv4(), quantity: 1 },
      ];
      (CartItem.findAll as jest.Mock).mockResolvedValue(mockItems);

      const result = await cartService.getCartItems(cartId);

      expect(CartItem.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            cartId,
            [Op.or]: [
              { reservationExpires: null },
              { reservationExpires: { [Op.gt]: expect.any(Date) } },
            ],
          },
        })
      );
      expect(result).toEqual(mockItems);
    });
  });

  describe("addItem", () => {
    it("should add an item to the cart", async () => {
      const userId = uuidv4();
      const productId = uuidv4();
      const quantity = 2;
      const mockUser = { id: userId };
      const mockProduct = {
        id: productId,
        stock: 5,
        save: jest.fn().mockResolvedValue(true),
      };
      const mockCart = { id: uuidv4() };
      const mockCartItem = {
        id: uuidv4(),
        quantity: 2,
        save: jest.fn().mockResolvedValue(true),
      };

      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
      (Product.findByPk as jest.Mock).mockResolvedValue(mockProduct);
      (Cart.findOrCreate as jest.Mock).mockResolvedValue([mockCart]);
      (CartItem.findOrCreate as jest.Mock).mockResolvedValue([
        mockCartItem,
        true,
      ]);

      const result = await cartService.addItem(userId, productId, quantity);

      expect(User.findByPk).toHaveBeenCalledWith(userId, expect.any(Object));
      expect(Product.findByPk).toHaveBeenCalledWith(
        productId,
        expect.any(Object)
      );
      expect(Cart.findOrCreate).toHaveBeenCalledWith(expect.any(Object));
      expect(CartItem.findOrCreate).toHaveBeenCalledWith(expect.any(Object));
      expect(mockProduct.save).toHaveBeenCalled();
      expect(mockCartItem.save).toHaveBeenCalled();
      expect(reservationExpirationQueue.add).toHaveBeenCalled();
      expect(result).toEqual(mockCartItem);
    });
  });

  describe("removeItem", () => {
    it("should remove an item from the cart", async () => {
      const itemId = uuidv4();
      const mockItem = {
        id: itemId,
        productId: uuidv4(),
        quantity: 2,
        destroy: jest.fn().mockResolvedValue(true),
      };
      const mockProduct = { id: mockItem.productId };

      (CartItem.findByPk as jest.Mock).mockResolvedValue(mockItem);
      (Product.findByPk as jest.Mock).mockResolvedValue(mockProduct);

      await cartService.removeItem(itemId);

      expect(CartItem.findByPk).toHaveBeenCalledWith(
        itemId,
        expect.any(Object)
      );
      expect(Product.findByPk).toHaveBeenCalledWith(
        mockItem.productId,
        expect.any(Object)
      );
      expect(mockItem.destroy).toHaveBeenCalled();
      expect(reservationExpirationQueue.removeJobs).toHaveBeenCalledWith(
        itemId
      );
      expect(stockReleaseQueue.add).toHaveBeenCalled();
    });
  });

  describe("updateItemQuantity", () => {
    it("should update the quantity of an item in the cart", async () => {
      const itemId = uuidv4();
      const newQuantity = 3;
      const mockItem = {
        id: itemId,
        productId: uuidv4(),
        quantity: 2,
        save: jest.fn().mockResolvedValue(true),
      };
      const mockProduct = {
        id: mockItem.productId,
        stock: 5,
        save: jest.fn().mockResolvedValue(true),
      };

      (CartItem.findByPk as jest.Mock).mockResolvedValue(mockItem);
      (Product.findByPk as jest.Mock).mockResolvedValue(mockProduct);

      const result = await cartService.updateItemQuantity(itemId, newQuantity);

      expect(CartItem.findByPk).toHaveBeenCalledWith(
        itemId,
        expect.any(Object)
      );
      expect(Product.findByPk).toHaveBeenCalledWith(
        mockItem.productId,
        expect.any(Object)
      );
      expect(mockProduct.save).toHaveBeenCalled();
      expect(mockItem.save).toHaveBeenCalled();
      expect(reservationExpirationQueue.removeJobs).toHaveBeenCalledWith(
        itemId
      );
      expect(reservationExpirationQueue.add).toHaveBeenCalled();
      expect(result).toEqual(
        expect.objectContaining({ quantity: newQuantity })
      );
    });
  });

  describe("clearExpiredReservations", () => {
    it("should clear expired reservations", async () => {
      const mockExpiredItems = [
        {
          id: uuidv4(),
          productId: uuidv4(),
          quantity: 2,
          destroy: jest.fn().mockResolvedValue(true),
        },
        {
          id: uuidv4(),
          productId: uuidv4(),
          quantity: 1,
          destroy: jest.fn().mockResolvedValue(true),
        },
      ];
      (CartItem.findAll as jest.Mock).mockResolvedValue(mockExpiredItems);
      (Product.findByPk as jest.Mock).mockResolvedValue({
        stock: 0,
        save: jest.fn().mockResolvedValue(true),
      });

      await cartService.clearExpiredReservations();

      expect(CartItem.findAll).toHaveBeenCalled();
      expect(Product.findByPk).toHaveBeenCalledTimes(mockExpiredItems.length);
      mockExpiredItems.forEach((item) => {
        expect(item.destroy).toHaveBeenCalled();
      });
    });
  });

  describe("getCartItemById", () => {
    it("should return a cart item by its id", async () => {
      const itemId = uuidv4();
      const mockItem = { id: itemId, productId: uuidv4(), quantity: 2 };
      (CartItem.findByPk as jest.Mock).mockResolvedValue(mockItem);

      const result = await cartService.getCartItemById(itemId);

      expect(CartItem.findByPk).toHaveBeenCalledWith(
        itemId,
        expect.any(Object)
      );
      expect(result).toEqual(mockItem);
    });
  });

  describe("clearCart", () => {
    it("should clear all items from a user's cart", async () => {
      const userId = uuidv4();
      const cartId = uuidv4();
      (Cart.findOne as jest.Mock).mockResolvedValue({ id: cartId });

      await cartService.clearCart(userId);

      expect(Cart.findOne).toHaveBeenCalledWith({
        where: { userId },
        attributes: ["id"],
      });
      expect(CartItem.destroy).toHaveBeenCalledWith({
        where: { cartId },
      });
    });

    it("should throw an error if cart is not found", async () => {
      const userId = uuidv4();
      (Cart.findOne as jest.Mock).mockResolvedValue(null);

      await expect(cartService.clearCart(userId)).rejects.toThrow(
        "Cart not found"
      );
    });
  });
});
