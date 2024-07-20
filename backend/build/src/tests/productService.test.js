"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const productService_1 = require("../services/productService");
const Product_1 = __importDefault(require("../models/Product"));
const CartItem_1 = __importDefault(require("../models/CartItem"));
jest.mock("../models/Product");
jest.mock("../models/CartItem");
jest.mock("../services/productMongoService");
describe("ProductService", () => {
    let productService;
    let mockSequelize;
    beforeEach(() => {
        jest.resetAllMocks();
        mockSequelize = {
            transaction: jest.fn(() => ({
                commit: jest.fn(),
                rollback: jest.fn(),
            })),
        };
        productService = new productService_1.ProductService(mockSequelize);
    });
    describe("create", () => {
        it("should create a new product with correct parameters", async () => {
            const productParams = {
                name: "Test Product",
                description: "Test Description",
                price: 10,
                brandId: (0, uuid_1.v4)(),
                categoryId: (0, uuid_1.v4)(),
                stock: 100,
                isPromotion: false,
                lowStockThreshold: 20,
            };
            const mockCreatedProduct = {
                id: (0, uuid_1.v4)(),
                ...productParams,
                stockHistory: [],
                toJSON: jest.fn().mockReturnValue({ id: (0, uuid_1.v4)(), ...productParams, stockHistory: [] })
            };
            Product_1.default.create.mockResolvedValue(mockCreatedProduct);
            Product_1.default.findByPk.mockResolvedValue(mockCreatedProduct);
            const result = await productService.create(productParams);
            expect(Product_1.default.create).toHaveBeenCalledWith(expect.objectContaining({
                ...productParams,
                id: expect.any(String),
                stockHistory: []
            }), undefined);
            expect(result).toEqual(expect.objectContaining(productParams));
        });
    });
    describe("get", () => {
        it("should retrieve a product by id", async () => {
            const productId = (0, uuid_1.v4)();
            const mockProduct = {
                id: productId,
                name: "Test Product",
                toJSON: jest.fn().mockReturnValue({ id: productId, name: "Test Product" })
            };
            Product_1.default.findByPk.mockResolvedValue(mockProduct);
            const result = await productService.get(productId);
            expect(Product_1.default.findByPk).toHaveBeenCalledWith(productId, expect.any(Object));
            expect(result).toEqual({ id: productId, name: "Test Product" });
        });
    });
    describe("update", () => {
        it("should update a product with correct parameters", async () => {
            const productId = (0, uuid_1.v4)();
            const updateParams = { name: "Updated Product", price: 15 };
            const mockUpdatedProduct = {
                id: productId,
                ...updateParams,
                toJSON: jest.fn().mockReturnValue({ id: productId, ...updateParams })
            };
            Product_1.default.update.mockResolvedValue([1]);
            Product_1.default.findByPk.mockResolvedValue(mockUpdatedProduct);
            const result = await productService.update(productId, updateParams);
            expect(Product_1.default.update).toHaveBeenCalledWith(updateParams, expect.any(Object));
            expect(result).toEqual({ id: productId, ...updateParams });
        });
    });
    describe("delete", () => {
        it("should delete a product", async () => {
            const productId = (0, uuid_1.v4)();
            CartItem_1.default.destroy.mockResolvedValue(1);
            Product_1.default.destroy.mockResolvedValue(1);
            const result = await productService.delete(productId);
            expect(CartItem_1.default.destroy).toHaveBeenCalledWith(expect.any(Object));
            expect(Product_1.default.destroy).toHaveBeenCalledWith(expect.any(Object));
            expect(result).toBe(true);
        });
    });
    describe("updateStock", () => {
        it("should update product stock", async () => {
            const productId = (0, uuid_1.v4)();
            const initialStock = 100;
            const stockChange = 50;
            const mockProduct = {
                id: productId,
                stock: initialStock,
                stockHistory: [],
                save: jest.fn(),
                toJSON: jest.fn().mockReturnValue({ id: productId, stock: initialStock + stockChange, stockHistory: [{ date: expect.any(Date), quantity: initialStock + stockChange }] }),
            };
            Product_1.default.findByPk.mockResolvedValue(mockProduct);
            const result = await productService.updateStock(productId, stockChange);
            expect(Product_1.default.findByPk).toHaveBeenCalledWith(productId, undefined);
            expect(mockProduct.save).toHaveBeenCalled();
            expect(result?.stock).toBe(initialStock + stockChange);
            expect(result?.stockHistory).toHaveLength(1);
            expect(result?.stockHistory[0].quantity).toBe(initialStock + stockChange);
        });
    });
    describe("getLowStockProducts", () => {
        it("should retrieve low stock products", async () => {
            const mockLowStockProducts = [
                { id: (0, uuid_1.v4)(), name: "Low Stock Product", stock: 5, toJSON: jest.fn().mockReturnValue({ id: (0, uuid_1.v4)(), name: "Low Stock Product", stock: 5 }) },
            ];
            Product_1.default.findAll.mockResolvedValue(mockLowStockProducts);
            const result = await productService.getLowStockProducts();
            expect(Product_1.default.findAll).toHaveBeenCalled();
            expect(result).toEqual([{ id: expect.any(String), name: "Low Stock Product", stock: 5 }]);
        });
    });
});
