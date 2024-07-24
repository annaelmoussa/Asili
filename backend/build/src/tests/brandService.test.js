"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const brandService_1 = require("../services/brandService");
const Brand_1 = __importDefault(require("../models/Brand"));
const Product_1 = __importDefault(require("../models/Product"));
const brandMongoService_1 = require("../services/brandMongoService");
const HttpError_1 = require("../types/HttpError");
jest.mock("../models/Brand");
jest.mock("../models/Product");
jest.mock("../services/brandMongoService");
jest.mock("../config/dbConfigPostgres", () => ({
    sequelize: {
        transaction: jest.fn(() => ({
            commit: jest.fn(),
            rollback: jest.fn(),
        })),
    },
}));
describe("BrandService", () => {
    let brandService;
    let mockSequelize;
    beforeEach(() => {
        jest.clearAllMocks();
        mockSequelize = {
            transaction: jest.fn(() => ({
                commit: jest.fn(),
                rollback: jest.fn(),
            })),
        };
        brandService = new brandService_1.BrandService(mockSequelize);
    });
    describe("get", () => {
        it("should return a brand by id", async () => {
            const mockBrand = {
                id: (0, uuid_1.v4)(),
                name: "Test Brand",
                toJSON: jest.fn(() => ({ id: (0, uuid_1.v4)(), name: "Test Brand" })),
            };
            Brand_1.default.findByPk.mockResolvedValue(mockBrand);
            const result = await brandService.get(mockBrand.id);
            expect(Brand_1.default.findByPk).toHaveBeenCalledWith(mockBrand.id, undefined);
            expect(result).toEqual({ id: expect.any(String), name: "Test Brand" });
        });
    });
    describe("getAll", () => {
        it("should return all brands", async () => {
            const mockBrands = [
                {
                    id: (0, uuid_1.v4)(),
                    name: "Brand 1",
                    toJSON: jest.fn(() => ({ id: (0, uuid_1.v4)(), name: "Brand 1" })),
                },
                {
                    id: (0, uuid_1.v4)(),
                    name: "Brand 2",
                    toJSON: jest.fn(() => ({ id: (0, uuid_1.v4)(), name: "Brand 2" })),
                },
            ];
            Brand_1.default.findAll.mockResolvedValue(mockBrands);
            const result = await brandService.getAll();
            expect(Brand_1.default.findAll).toHaveBeenCalled();
            expect(result).toEqual([
                { id: expect.any(String), name: "Brand 1" },
                { id: expect.any(String), name: "Brand 2" },
            ]);
        });
    });
    describe("create", () => {
        it("should create a new brand", async () => {
            const brandParams = { name: "New Brand" };
            const mockCreatedBrand = {
                id: (0, uuid_1.v4)(),
                ...brandParams,
                toJSON: jest.fn(() => ({ id: (0, uuid_1.v4)(), ...brandParams })),
            };
            Brand_1.default.create.mockResolvedValue(mockCreatedBrand);
            const result = await brandService.create(brandParams);
            expect(Brand_1.default.create).toHaveBeenCalledWith(brandParams, undefined);
            expect(result).toEqual({ id: expect.any(String), name: "New Brand" });
        });
    });
    describe("update", () => {
        it("should update a brand", async () => {
            const brandId = (0, uuid_1.v4)();
            const updates = { name: "Updated Brand" };
            const mockUpdatedBrand = {
                id: brandId,
                ...updates,
                toJSON: jest.fn(() => ({ id: brandId, ...updates })),
            };
            Brand_1.default.update.mockResolvedValue([1, [mockUpdatedBrand]]);
            const result = await brandService.update(brandId, updates);
            expect(Brand_1.default.update).toHaveBeenCalledWith(updates, expect.any(Object));
            expect(result).toEqual({ id: brandId, name: "Updated Brand" });
            expect(brandMongoService_1.BrandMongoService.prototype.syncWithPostgres).toHaveBeenCalled();
        });
        it("should throw HttpError if brand not found", async () => {
            const brandId = (0, uuid_1.v4)();
            const updates = { name: "Updated Brand" };
            Brand_1.default.update.mockResolvedValue([0, []]);
            await expect(brandService.update(brandId, updates)).rejects.toThrow(HttpError_1.HttpError);
        });
    });
    describe("delete", () => {
        it("should delete a brand if no products are associated", async () => {
            const brandId = (0, uuid_1.v4)();
            Product_1.default.count.mockResolvedValue(0);
            Brand_1.default.destroy.mockResolvedValue(1);
            const result = await brandService.delete(brandId);
            expect(Product_1.default.count).toHaveBeenCalledWith(expect.any(Object));
            expect(Brand_1.default.destroy).toHaveBeenCalledWith(expect.any(Object));
            expect(result).toEqual({
                success: true,
                message: "Marque supprimée avec succès.",
            });
        });
        it("should not delete a brand if products are associated", async () => {
            const brandId = (0, uuid_1.v4)();
            Product_1.default.count.mockResolvedValue(1);
            const result = await brandService.delete(brandId);
            expect(Product_1.default.count).toHaveBeenCalledWith(expect.any(Object));
            expect(Brand_1.default.destroy).not.toHaveBeenCalled();
            expect(result).toEqual({
                success: false,
                message: expect.stringContaining("Impossible de supprimer la marque"),
            });
        });
    });
    describe("getByName", () => {
        it("should return a brand by name", async () => {
            const brandName = "Test Brand";
            const mockBrand = { id: (0, uuid_1.v4)(), name: brandName };
            Brand_1.default.findOne.mockResolvedValue(mockBrand);
            const result = await brandService.getByName(brandName);
            expect(Brand_1.default.findOne).toHaveBeenCalledWith({
                where: { name: brandName },
            });
            expect(result).toEqual(mockBrand);
        });
    });
});
