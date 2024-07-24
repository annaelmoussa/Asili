import { v4 as uuidv4 } from "uuid";
import { CategoryService } from "../services/categoryService";
import Category from "../models/Category";
import Product from "../models/Product";
import { ICategory, CategoryCreationParams } from "../interfaces/ICategory";
import { Sequelize } from "sequelize";

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
  let categoryService: CategoryService;
  let mockSequelize: jest.Mocked<Sequelize>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSequelize = {
      transaction: jest.fn(() => ({
        commit: jest.fn(),
        rollback: jest.fn(),
      })),
    } as unknown as jest.Mocked<Sequelize>;
    categoryService = new CategoryService(mockSequelize);
  });

  describe("get", () => {
    it("should return a category by id", async () => {
      const mockCategory = {
        id: uuidv4(),
        name: "Test Category",
        toJSON: jest.fn(() => ({ id: uuidv4(), name: "Test Category" })),
      };
      (Category.findByPk as jest.Mock).mockResolvedValue(mockCategory);

      const result = await categoryService.get(mockCategory.id);

      expect(Category.findByPk).toHaveBeenCalledWith(
        mockCategory.id,
        undefined
      );
      expect(result).toEqual({ id: expect.any(String), name: "Test Category" });
    });
  });

  describe("getAll", () => {
    it("should return all categories", async () => {
      const mockCategories = [
        {
          id: uuidv4(),
          name: "Category 1",
          toJSON: jest.fn(() => ({ id: uuidv4(), name: "Category 1" })),
        },
        {
          id: uuidv4(),
          name: "Category 2",
          toJSON: jest.fn(() => ({ id: uuidv4(), name: "Category 2" })),
        },
      ];
      (Category.findAll as jest.Mock).mockResolvedValue(mockCategories);

      const result = await categoryService.getAll();

      expect(Category.findAll).toHaveBeenCalled();
      expect(result).toEqual([
        { id: expect.any(String), name: "Category 1" },
        { id: expect.any(String), name: "Category 2" },
      ]);
    });
  });

  describe("create", () => {
    it("should create a new category", async () => {
      const categoryParams: CategoryCreationParams = { name: "New Category" };
      const mockCreatedCategory = {
        id: uuidv4(),
        ...categoryParams,
        toJSON: jest.fn(() => ({ id: uuidv4(), ...categoryParams })),
      };
      (Category.create as jest.Mock).mockResolvedValue(mockCreatedCategory);

      const result = await categoryService.create(categoryParams);

      expect(Category.create).toHaveBeenCalledWith(categoryParams, undefined);
      expect(result).toEqual({ id: expect.any(String), name: "New Category" });
    });
  });

  describe("update", () => {
    it("should update a category", async () => {
      const categoryId = uuidv4();
      const updates: Partial<ICategory> = { name: "Updated Category" };
      const mockUpdatedCategory = {
        id: categoryId,
        ...updates,
        toJSON: jest.fn(() => ({ id: categoryId, ...updates })),
      };
      (Category.update as jest.Mock).mockResolvedValue([
        1,
        [mockUpdatedCategory],
      ]);

      const result = await categoryService.update(categoryId, updates);

      expect(Category.update).toHaveBeenCalledWith(
        updates,
        expect.objectContaining({
          where: { id: categoryId },
          returning: true,
        })
      );
      expect(result).toEqual({ id: categoryId, name: "Updated Category" });
    });

    it("should return null if category not found", async () => {
      const categoryId = uuidv4();
      const updates: Partial<ICategory> = { name: "Updated Category" };
      (Category.update as jest.Mock).mockResolvedValue([0, []]);

      const result = await categoryService.update(categoryId, updates);

      expect(result).toBeNull();
    });
  });

  describe("delete", () => {
    it("should delete a category if no products are associated", async () => {
      const categoryId = uuidv4();
      (Product.count as jest.Mock).mockResolvedValue(0);
      (Category.destroy as jest.Mock).mockResolvedValue(1);

      const result = await categoryService.delete(categoryId);

      expect(Product.count).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { categoryId },
        })
      );
      expect(Category.destroy).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: categoryId },
        })
      );
      expect(result).toEqual({
        success: true,
        message: "Catégorie supprimée avec succès.",
      });
    });

    it("should not delete a category if products are associated", async () => {
      const categoryId = uuidv4();
      (Product.count as jest.Mock).mockResolvedValue(1);

      const result = await categoryService.delete(categoryId);

      expect(Product.count).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { categoryId },
        })
      );
      expect(Category.destroy).not.toHaveBeenCalled();
      expect(result).toEqual({
        success: false,
        message: expect.stringContaining(
          "Impossible de supprimer la catégorie"
        ),
      });
    });
  });

  describe("getByName", () => {
    it("should return a category by name", async () => {
      const categoryName = "Test Category";
      const mockCategory = { id: uuidv4(), name: categoryName };
      (Category.findOne as jest.Mock).mockResolvedValue(mockCategory);

      const result = await categoryService.getByName(categoryName);

      expect(Category.findOne).toHaveBeenCalledWith({
        where: { name: categoryName },
      });
      expect(result).toEqual(mockCategory);
    });
  });
});
