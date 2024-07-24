import { v4 as uuidv4 } from "uuid";
import { BrandService } from "../services/brandService";
import Brand from "../models/Brand";
import Product from "../models/Product";
import { BrandMongoService } from "../services/brandMongoService";
import { HttpError } from "../types/HttpError";
import { IBrand, BrandCreationParams } from "../interfaces/IBrand";
import { Sequelize } from "sequelize";

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
  let brandService: BrandService;
  let mockSequelize: jest.Mocked<Sequelize>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSequelize = {
      transaction: jest.fn(() => ({
        commit: jest.fn(),
        rollback: jest.fn(),
      })),
    } as unknown as jest.Mocked<Sequelize>;
    brandService = new BrandService(mockSequelize);
  });

  describe("get", () => {
    it("should return a brand by id", async () => {
      const mockBrand = {
        id: uuidv4(),
        name: "Test Brand",
        toJSON: jest.fn(() => ({ id: uuidv4(), name: "Test Brand" })),
      };
      (Brand.findByPk as jest.Mock).mockResolvedValue(mockBrand);

      const result = await brandService.get(mockBrand.id);

      expect(Brand.findByPk).toHaveBeenCalledWith(mockBrand.id, undefined);
      expect(result).toEqual({ id: expect.any(String), name: "Test Brand" });
    });
  });

  describe("getAll", () => {
    it("should return all brands", async () => {
      const mockBrands = [
        {
          id: uuidv4(),
          name: "Brand 1",
          toJSON: jest.fn(() => ({ id: uuidv4(), name: "Brand 1" })),
        },
        {
          id: uuidv4(),
          name: "Brand 2",
          toJSON: jest.fn(() => ({ id: uuidv4(), name: "Brand 2" })),
        },
      ];
      (Brand.findAll as jest.Mock).mockResolvedValue(mockBrands);

      const result = await brandService.getAll();

      expect(Brand.findAll).toHaveBeenCalled();
      expect(result).toEqual([
        { id: expect.any(String), name: "Brand 1" },
        { id: expect.any(String), name: "Brand 2" },
      ]);
    });
  });

  describe("create", () => {
    it("should create a new brand", async () => {
      const brandParams: BrandCreationParams = { name: "New Brand" };
      const mockCreatedBrand = {
        id: uuidv4(),
        ...brandParams,
        toJSON: jest.fn(() => ({ id: uuidv4(), ...brandParams })),
      };
      (Brand.create as jest.Mock).mockResolvedValue(mockCreatedBrand);

      const result = await brandService.create(brandParams);

      expect(Brand.create).toHaveBeenCalledWith(brandParams, undefined);
      expect(result).toEqual({ id: expect.any(String), name: "New Brand" });
    });
  });

  describe("update", () => {
    it("should update a brand", async () => {
      const brandId = uuidv4();
      const updates: Partial<IBrand> = { name: "Updated Brand" };
      const mockUpdatedBrand = {
        id: brandId,
        ...updates,
        toJSON: jest.fn(() => ({ id: brandId, ...updates })),
      };
      (Brand.update as jest.Mock).mockResolvedValue([1, [mockUpdatedBrand]]);

      const result = await brandService.update(brandId, updates);

      expect(Brand.update).toHaveBeenCalledWith(updates, expect.any(Object));
      expect(result).toEqual({ id: brandId, name: "Updated Brand" });
      expect(BrandMongoService.prototype.syncWithPostgres).toHaveBeenCalled();
    });

    it("should throw HttpError if brand not found", async () => {
      const brandId = uuidv4();
      const updates: Partial<IBrand> = { name: "Updated Brand" };
      (Brand.update as jest.Mock).mockResolvedValue([0, []]);

      await expect(brandService.update(brandId, updates)).rejects.toThrow(
        HttpError
      );
    });
  });

  describe("delete", () => {
    it("should delete a brand if no products are associated", async () => {
      const brandId = uuidv4();
      (Product.count as jest.Mock).mockResolvedValue(0);
      (Brand.destroy as jest.Mock).mockResolvedValue(1);

      const result = await brandService.delete(brandId);

      expect(Product.count).toHaveBeenCalledWith(expect.any(Object));
      expect(Brand.destroy).toHaveBeenCalledWith(expect.any(Object));
      expect(result).toEqual({
        success: true,
        message: "Marque supprimée avec succès.",
      });
    });

    it("should not delete a brand if products are associated", async () => {
      const brandId = uuidv4();
      (Product.count as jest.Mock).mockResolvedValue(1);

      const result = await brandService.delete(brandId);

      expect(Product.count).toHaveBeenCalledWith(expect.any(Object));
      expect(Brand.destroy).not.toHaveBeenCalled();
      expect(result).toEqual({
        success: false,
        message: expect.stringContaining("Impossible de supprimer la marque"),
      });
    });
  });

  describe("getByName", () => {
    it("should return a brand by name", async () => {
      const brandName = "Test Brand";
      const mockBrand = { id: uuidv4(), name: brandName };
      (Brand.findOne as jest.Mock).mockResolvedValue(mockBrand);

      const result = await brandService.getByName(brandName);

      expect(Brand.findOne).toHaveBeenCalledWith({
        where: { name: brandName },
      });
      expect(result).toEqual(mockBrand);
    });
  });
});
