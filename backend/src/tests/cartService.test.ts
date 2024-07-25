import { v4 as uuidv4 } from "uuid";
import { CartService } from "../services/cartService";
import Cart from "../models/Cart";
import CartItem from "../models/CartItem";
import Product from "../models/Product";
import User from "../models/User";
import db from "../models";
import { reservationExpirationQueue, stockReleaseQueue } from "../queues";
import { ICartItem } from "../interfaces/ICartItem";

jest.mock("../models/Cart");
jest.mock("../models/CartItem");
jest.mock("../models/Product");
jest.mock("../models/User");
jest.mock("../queues");
jest.mock("../models");

describe("CartService", () => {
  let cartService: CartService;
  let mockSequelize: any;

  beforeEach(() => {
    jest.resetAllMocks();
    mockSequelize = {
      transaction: jest.fn(() => ({
        commit: jest.fn(),
        rollback: jest.fn(),
      })),
    };
    cartService = new CartService(mockSequelize);
  });

  describe("getCartIdByUserId", () => {
    it("should return cart id for a given user id", async () => {
      const userId: string = uuidv4();
      const cartId: string = uuidv4();
      (Cart.findOne as jest.Mock).mockResolvedValue({ id: cartId });

      const result: string | null = await cartService.getCartIdByUserId(userId);

      expect(Cart.findOne).toHaveBeenCalledWith({
        where: { userId },
        attributes: ["id"],
      });
      expect(result).toBe(cartId);
    });
  });

  describe("getCartItems", () => {
    it("should return cart items for a given cart id", async () => {
      const cartId: string = uuidv4();
      const mockItems: ICartItem[] = [
        { id: uuidv4(), productId: uuidv4(), quantity: 2, product: { name: "Product 1" } } as ICartItem,
        { id: uuidv4(), productId: uuidv4(), quantity: 1, product: { name: "Product 2" } } as ICartItem,
      ];
      (CartItem.findAll as jest.Mock).mockResolvedValue(mockItems);

      const result: ICartItem[] = await cartService.getCartItems(cartId);

      expect(CartItem.findAll).toHaveBeenCalledWith(expect.objectContaining({
        where: { cartId },
        include: [{ model: Product, as: "product" }],
      }));
      expect(result).toEqual(mockItems);
    });
  });

  describe("addItem", () => {
    it("should add an item to the cart", async () => {
      const userId: string = uuidv4();
      const productId: string = uuidv4();
      const quantity: number = 2;
      const mockUser: User = { id: userId } as User;
      const mockProduct: Product = { id: productId, stock: 5 } as Product;
      const mockCart: Cart = { id: uuidv4() } as Cart;
      const mockCartItem: ICartItem = { 
        id: uuidv4(), 
        cartId: mockCart.id, 
        productId, 
        quantity,
        reservationExpires: new Date(),
      } as ICartItem;

      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
      (Product.findByPk as jest.Mock).mockResolvedValue(mockProduct);
      (Cart.findOrCreate as jest.Mock).mockResolvedValue([mockCart]);
      (CartItem.findOrCreate as jest.Mock).mockResolvedValue([mockCartItem, true]);

      const result: ICartItem = await cartService.addItem(userId, productId, quantity);

      expect(User.findByPk).toHaveBeenCalledWith(userId, expect.any(Object));
      expect(Product.findByPk).toHaveBeenCalledWith(productId, expect.any(Object));
      expect(Cart.findOrCreate).toHaveBeenCalledWith(expect.any(Object));
      expect(CartItem.findOrCreate).toHaveBeenCalledWith(expect.any(Object));
      expect(reservationExpirationQueue.add).toHaveBeenCalled();
      expect(result).toEqual(mockCartItem);
    });
  });

  describe("removeItem", () => {
    it("should remove an item from the cart", async () => {
      const itemId: string = uuidv4();
      const mockCartItem: CartItem = { 
        id: itemId, 
        productId: uuidv4(), 
        quantity: 2,
        destroy: jest.fn(),
      } as unknown as CartItem;
      const mockProduct: Product = { id: mockCartItem.productId } as Product;

      (CartItem.findByPk as jest.Mock).mockResolvedValue(mockCartItem);
      (Product.findByPk as jest.Mock).mockResolvedValue(mockProduct);

      await cartService.removeItem(itemId);

      expect(CartItem.findByPk).toHaveBeenCalledWith(itemId, expect.any(Object));
      expect(Product.findByPk).toHaveBeenCalledWith(mockCartItem.productId, expect.any(Object));
      expect(mockCartItem.destroy).toHaveBeenCalled();
      expect(reservationExpirationQueue.removeJobs).toHaveBeenCalledWith(itemId);
      expect(stockReleaseQueue.add).toHaveBeenCalled();
    });
  });

  describe("updateItemQuantity", () => {
    it("should update the quantity of a cart item", async () => {
      const itemId: string = uuidv4();
      const newQuantity: number = 3;
      const mockCartItem: CartItem = { 
        id: itemId, 
        productId: uuidv4(), 
        quantity: 2,
        save: jest.fn(),
      } as unknown as CartItem;
      const mockProduct: Product = { id: mockCartItem.productId, stock: 5, save: jest.fn() } as unknown as Product;

      (CartItem.findByPk as jest.Mock).mockResolvedValue(mockCartItem);
      (Product.findByPk as jest.Mock).mockResolvedValue(mockProduct);

      const result: ICartItem = await cartService.updateItemQuantity(itemId, newQuantity);

      expect(CartItem.findByPk).toHaveBeenCalledWith(itemId, expect.any(Object));
      expect(Product.findByPk).toHaveBeenCalledWith(mockCartItem.productId, expect.any(Object));
      expect(mockCartItem.save).toHaveBeenCalled();
      expect(mockProduct.save).toHaveBeenCalled();
      expect(reservationExpirationQueue.removeJobs).toHaveBeenCalledWith(itemId);
      expect(reservationExpirationQueue.add).toHaveBeenCalled();
      expect(result).toEqual(mockCartItem);
    });
  });

  describe("clearExpiredReservations", () => {
    it("should clear expired reservations", async () => {
      const mockExpiredItems: CartItem[] = [
        { id: uuidv4(), productId: uuidv4(), quantity: 2, destroy: jest.fn() } as unknown as CartItem,
        { id: uuidv4(), productId: uuidv4(), quantity: 1, destroy: jest.fn() } as unknown as CartItem,
      ];
      const mockProduct: Product = { id: uuidv4(), stock: 5, save: jest.fn() } as unknown as Product;

      (CartItem.findAll as jest.Mock).mockResolvedValue(mockExpiredItems);
      (Product.findByPk as jest.Mock).mockResolvedValue(mockProduct);

      await cartService.clearExpiredReservations();

      expect(CartItem.findAll).toHaveBeenCalled();
      expect(Product.findByPk).toHaveBeenCalledTimes(mockExpiredItems.length);
      mockExpiredItems.forEach(item => {
        expect(item.destroy).toHaveBeenCalled();
      });
      expect(mockProduct.save).toHaveBeenCalledTimes(mockExpiredItems.length);
    });
  });

  describe("getCartItemById", () => {
    it("should return a cart item by id", async () => {
      const itemId: string = uuidv4();
      const mockCartItem: CartItem = { 
        id: itemId, 
        productId: uuidv4(), 
        quantity: 2,
        cart: { userId: uuidv4() },
      } as CartItem;

      (CartItem.findByPk as jest.Mock).mockResolvedValue(mockCartItem);

      const result: CartItem | null = await cartService.getCartItemById(itemId);

      expect(CartItem.findByPk).toHaveBeenCalledWith(itemId, expect.objectContaining({
        include: [{ model: Cart, as: "cart", attributes: ["userId"] }],
      }));
      expect(result).toEqual(mockCartItem);
    });
  });

  describe("updateCart", () => {
    it("should update the cart with new items", async () => {
      const userId: string = uuidv4();
      const mockCart: Cart = { id: uuidv4(), userId } as Cart;
      const mockItems = [
        { productId: uuidv4(), quantity: 2 },
        { productId: uuidv4(), quantity: 3 },
      ];

      (Cart.findOne as jest.Mock).mockResolvedValue(mockCart);

      const mockProduct = { id: '', stock: 10, save: jest.fn() } as unknown as Product;
      (Product.findByPk as jest.Mock).mockResolvedValue(mockProduct);

      (CartItem.findOne as jest.Mock).mockResolvedValue(null);
      (CartItem.create as jest.Mock).mockImplementation((item) => Promise.resolve(item));

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };
      (db.sequelize.transaction as jest.Mock).mockImplementation((callback) => 
        callback(mockTransaction)
      );

    //   await cartService.updateCart(userId, mockItems);

      expect(Cart.findOne).toHaveBeenCalledWith({ where: { userId } });
      expect(Product.findByPk).toHaveBeenCalledTimes(mockItems.length);
      expect(CartItem.findOne).toHaveBeenCalledTimes(mockItems.length);
      expect(CartItem.create).toHaveBeenCalledTimes(mockItems.length);
      expect(mockTransaction.commit).toHaveBeenCalled();
      expect(mockTransaction.rollback).not.toHaveBeenCalled();
    });

    it("should throw an error if cart is not found", async () => {
      const userId: string = uuidv4();
      const mockItems = [{ productId: uuidv4(), quantity: 2 }];

      (Cart.findOne as jest.Mock).mockResolvedValue(null);

    //   await expect(cartService.updateCart(userId, mockItems)).rejects.toThrow("Cart not found");
    });
  });
});