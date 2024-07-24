"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const categoryService_1 = require("../services/categoryService");
const Category_1 = __importDefault(require("../models/Category"));
const Product_1 = __importDefault(require("../models/Product"));
jest.mock("../models/Category");
jest.mock("../models/Product");
jest.mock("../config/dbConfigPostgres", () => ({
    sequelize: {
        transaction: jest.fn(() => ({
            commit: jest.fn(),
            rollback: jest.fn(),
        })),
    },
}));
describe("CategoryService", () => {
    let categoryService;
    let mockSequelize;
    beforeEach(() => {
        jest.clearAllMocks();
        mockSequelize = {
            transaction: jest.fn(() => ({
                commit: jest.fn(),
                rollback: jest.fn(),
            })),
        };
        categoryService = new categoryService_1.CategoryService(mockSequelize);
    });
    describe("get", () => {
        it("should return a category by id", async () => {
            const mockCategory = {
                id: (0, uuid_1.v4)(),
                name: "Test Category",
                toJSON: jest.fn(() => ({ id: (0, uuid_1.v4)(), name: "Test Category" })),
            };
            Category_1.default.findByPk.mockResolvedValue(mockCategory);
            const result = await categoryService.get(mockCategory.id);
            expect(Category_1.default.findByPk).toHaveBeenCalledWith(mockCategory.id, undefined);
            expect(result).toEqual({ id: expect.any(String), name: "Test Category" });
        });
    });
    describe("getAll", () => {
        it("should return all categories", async () => {
            const mockCategories = [
                {
                    id: (0, uuid_1.v4)(),
                    name: "Category 1",
                    toJSON: jest.fn(() => ({ id: (0, uuid_1.v4)(), name: "Category 1" })),
                },
                {
                    id: (0, uuid_1.v4)(),
                    name: "Category 2",
                    toJSON: jest.fn(() => ({ id: (0, uuid_1.v4)(), name: "Category 2" })),
                },
            ];
            Category_1.default.findAll.mockResolvedValue(mockCategories);
            const result = await categoryService.getAll();
            expect(Category_1.default.findAll).toHaveBeenCalled();
            expect(result).toEqual([
                { id: expect.any(String), name: "Category 1" },
                { id: expect.any(String), name: "Category 2" },
            ]);
        });
    });
    describe("create", () => {
        it("should create a new category", async () => {
            const categoryParams = { name: "New Category" };
            const mockCreatedCategory = {
                id: (0, uuid_1.v4)(),
                ...categoryParams,
                toJSON: jest.fn(() => ({ id: (0, uuid_1.v4)(), ...categoryParams })),
            };
            Category_1.default.create.mockResolvedValue(mockCreatedCategory);
            const result = await categoryService.create(categoryParams);
            expect(Category_1.default.create).toHaveBeenCalledWith(categoryParams, undefined);
            expect(result).toEqual({ id: expect.any(String), name: "New Category" });
        });
    });
    describe("update", () => {
        it("should update a category", async () => {
            const categoryId = (0, uuid_1.v4)();
            const updates = { name: "Updated Category" };
            const mockUpdatedCategory = {
                id: categoryId,
                ...updates,
                toJSON: jest.fn(() => ({ id: categoryId, ...updates })),
            };
            Category_1.default.update.mockResolvedValue([
                1,
                [mockUpdatedCategory],
            ]);
            const result = await categoryService.update(categoryId, updates);
            expect(Category_1.default.update).toHaveBeenCalledWith(updates, expect.objectContaining({
                where: { id: categoryId },
                returning: true,
            }));
            expect(result).toEqual({ id: categoryId, name: "Updated Category" });
        });
        it("should return null if category not found", async () => {
            const categoryId = (0, uuid_1.v4)();
            const updates = { name: "Updated Category" };
            Category_1.default.update.mockResolvedValue([0, []]);
            const result = await categoryService.update(categoryId, updates);
            expect(result).toBeNull();
        });
    });
    describe("delete", () => {
        it("should delete a category if no products are associated", async () => {
            const categoryId = (0, uuid_1.v4)();
            Product_1.default.count.mockResolvedValue(0);
            Category_1.default.destroy.mockResolvedValue(1);
            const result = await categoryService.delete(categoryId);
            expect(Product_1.default.count).toHaveBeenCalledWith(expect.objectContaining({
                where: { categoryId },
            }));
            expect(Category_1.default.destroy).toHaveBeenCalledWith(expect.objectContaining({
                where: { id: categoryId },
            }));
            expect(result).toEqual({
                success: true,
                message: "Catégorie supprimée avec succès.",
            });
        });
        it("should not delete a category if products are associated", async () => {
            const categoryId = (0, uuid_1.v4)();
            Product_1.default.count.mockResolvedValue(1);
            const result = await categoryService.delete(categoryId);
            expect(Product_1.default.count).toHaveBeenCalledWith(expect.objectContaining({
                where: { categoryId },
            }));
            expect(Category_1.default.destroy).not.toHaveBeenCalled();
            expect(result).toEqual({
                success: false,
                message: expect.stringContaining("Impossible de supprimer la catégorie"),
            });
        });
    });
    describe("getByName", () => {
        it("should return a category by name", async () => {
            const categoryName = "Test Category";
            const mockCategory = { id: (0, uuid_1.v4)(), name: categoryName };
            Category_1.default.findOne.mockResolvedValue(mockCategory);
            const result = await categoryService.getByName(categoryName);
            expect(Category_1.default.findOne).toHaveBeenCalledWith({
                where: { name: categoryName },
            });
            expect(result).toEqual(mockCategory);
        });
    });
});
