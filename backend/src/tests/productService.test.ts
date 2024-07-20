import { v4 as uuidv4 } from "uuid";
import { ProductService } from "../services/productService";
import { ProductCreationParams } from "../interfaces/IProduct";
import Product from "../models/Product";
import CartItem from "../models/CartItem";

jest.mock("../models/Product");
jest.mock("../models/CartItem");
jest.mock("../services/productMongoService");

describe("ProductService", () => {
  let productService: ProductService;
  let mockSequelize: any;

  beforeEach(() => {
    jest.resetAllMocks();
    mockSequelize = {
      transaction: jest.fn(() => ({
        commit: jest.fn(),
        rollback: jest.fn(),
      })),
    };
    productService = new ProductService(mockSequelize);
  });

  describe("create", () => {
    it("should create a new product with correct parameters", async () => {
      const productParams: ProductCreationParams = {
        name: "Test Product",
        description: "Test Description",
        price: 10,
        brandId: uuidv4(),
        categoryId: uuidv4(),
        stock: 100,
        isPromotion: false,
        lowStockThreshold: 20,
      };

      const mockCreatedProduct = { 
        id: uuidv4(),
        ...productParams,
        stockHistory: [],
        toJSON: jest.fn().mockReturnValue({ id: uuidv4(), ...productParams, stockHistory: [] })
      };

      (Product.create as jest.Mock).mockResolvedValue(mockCreatedProduct);
      (Product.findByPk as jest.Mock).mockResolvedValue(mockCreatedProduct);

      const result = await productService.create(productParams);

      expect(Product.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ...productParams,
          id: expect.any(String),
          stockHistory: []
        }),
        undefined
      );
      expect(result).toEqual(expect.objectContaining(productParams));
    });
  });

  describe("get", () => {
    it("should retrieve a product by id", async () => {
      const productId = uuidv4();
      const mockProduct = { 
        id: productId, 
        name: "Test Product",
        toJSON: jest.fn().mockReturnValue({ id: productId, name: "Test Product" })
      };
      (Product.findByPk as jest.Mock).mockResolvedValue(mockProduct);

      const result = await productService.get(productId);

      expect(Product.findByPk).toHaveBeenCalledWith(productId, expect.any(Object));
      expect(result).toEqual({ id: productId, name: "Test Product" });
    });
  });

  describe("update", () => {
    it("should update a product with correct parameters", async () => {
      const productId = uuidv4();
      const updateParams = { name: "Updated Product", price: 15 };
      const mockUpdatedProduct = { 
        id: productId, 
        ...updateParams,
        toJSON: jest.fn().mockReturnValue({ id: productId, ...updateParams })
      };
      (Product.update as jest.Mock).mockResolvedValue([1]);
      (Product.findByPk as jest.Mock).mockResolvedValue(mockUpdatedProduct);

      const result = await productService.update(productId, updateParams);

      expect(Product.update).toHaveBeenCalledWith(updateParams, expect.any(Object));
      expect(result).toEqual({ id: productId, ...updateParams });
    });
  });

  describe("delete", () => {
    it("should delete a product", async () => {
      const productId = uuidv4();
      (CartItem.destroy as jest.Mock).mockResolvedValue(1);
      (Product.destroy as jest.Mock).mockResolvedValue(1);

      const result = await productService.delete(productId);

      expect(CartItem.destroy).toHaveBeenCalledWith(expect.any(Object));
      expect(Product.destroy).toHaveBeenCalledWith(expect.any(Object));
      expect(result).toBe(true);
    });
  });

  describe("updateStock", () => {
    it("should update product stock", async () => {
      const productId = uuidv4();
      const initialStock = 100;
      const stockChange = 50;
      const mockProduct = {
        id: productId,
        stock: initialStock,
        stockHistory: [],
        save: jest.fn(),
        toJSON: jest.fn().mockReturnValue({ id: productId, stock: initialStock + stockChange, stockHistory: [{ date: expect.any(Date), quantity: initialStock + stockChange }] }),
      };
      (Product.findByPk as jest.Mock).mockResolvedValue(mockProduct);

      const result = await productService.updateStock(productId, stockChange);

      expect(Product.findByPk).toHaveBeenCalledWith(productId, undefined);
      expect(mockProduct.save).toHaveBeenCalled();
      expect(result?.stock).toBe(initialStock + stockChange);
      expect(result?.stockHistory).toHaveLength(1);
      expect(result?.stockHistory[0].quantity).toBe(initialStock + stockChange);
    });
  });

  describe("getLowStockProducts", () => {
    it("should retrieve low stock products", async () => {
      const mockLowStockProducts = [
        { id: uuidv4(), name: "Low Stock Product", stock: 5, toJSON: jest.fn().mockReturnValue({ id: uuidv4(), name: "Low Stock Product", stock: 5 }) },
      ];
      (Product.findAll as jest.Mock).mockResolvedValue(mockLowStockProducts);

      const result = await productService.getLowStockProducts();

      expect(Product.findAll).toHaveBeenCalled();
      expect(result).toEqual([{ id: expect.any(String), name: "Low Stock Product", stock: 5 }]);
    });
  });
});