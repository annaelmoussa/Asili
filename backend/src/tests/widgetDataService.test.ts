import { WidgetDataService } from "../services/WidgetDataService";
import ProductMongo from "../models/ProductMongo";
import { MongoOrder } from "../models/MongoOrder";
import User from "../models/User";
import { Sequelize } from "sequelize-typescript";

jest.mock("../models/ProductMongo");
jest.mock("../models/MongoOrder");
jest.mock("../models/User");

describe("WidgetDataService", () => {
  let widgetDataService: WidgetDataService;

  beforeEach(() => {
    widgetDataService = new WidgetDataService();
    jest.clearAllMocks();
  });

  describe("getDataForWidget", () => {
    it("should call getDataForModelType with the correct model type", async () => {
      const mockWidget = { modelType: "Products" };
      const spy = jest.spyOn(widgetDataService as any, "getDataForModelType");
      await widgetDataService.getDataForWidget(mockWidget as any);
      expect(spy).toHaveBeenCalledWith("Products");
    });
  });

  describe("getDataForModelType", () => {
    it('should return product data for "Products" type', async () => {
      const spy = jest.spyOn(widgetDataService as any, "getProductData");
      await widgetDataService.getDataForModelType("Products");
      expect(spy).toHaveBeenCalled();
    });

    it('should return user data for "Users" type', async () => {
      const spy = jest.spyOn(widgetDataService as any, "getUserData");
      await widgetDataService.getDataForModelType("Users");
      expect(spy).toHaveBeenCalled();
    });

    it('should return order data for "Orders" type', async () => {
      const spy = jest.spyOn(widgetDataService as any, "getOrderData");
      await widgetDataService.getDataForModelType("Orders");
      expect(spy).toHaveBeenCalled();
    });

    it("should throw an error for unsupported model type", async () => {
      await expect(
        widgetDataService.getDataForModelType("InvalidType")
      ).rejects.toThrow("Unsupported model type: InvalidType");
    });
  });

  describe("getProductData", () => {
    it("should return price distribution and stock levels", async () => {
      const mockPriceDistribution = [{ _id: 10, count: 5 }];
      const mockStockLevels = [{ _id: 100, count: 3 }];
      (ProductMongo.aggregate as jest.Mock)
        .mockResolvedValueOnce(mockPriceDistribution)
        .mockResolvedValueOnce(mockStockLevels);

      const result = await (widgetDataService as any).getProductData();

      expect(result).toEqual({
        priceDistribution: mockPriceDistribution,
        stockLevels: mockStockLevels,
      });
    });
  });

  describe("getUserData", () => {
    it("should return role distribution and confirmation status", async () => {
      const mockRoleDistribution = [{ role: "admin", count: 2 }];
      const mockConfirmationStatus = [{ isConfirmed: true, count: 5 }];
      (User.findAll as jest.Mock)
        .mockResolvedValueOnce(mockRoleDistribution)
        .mockResolvedValueOnce(mockConfirmationStatus);

      const result = await (widgetDataService as any).getUserData();

      expect(result).toEqual({
        roleDistribution: mockRoleDistribution,
        confirmationStatus: mockConfirmationStatus,
      });
    });
  });

  describe("getOrderData", () => {
    it("should return order status distribution and revenue over time", async () => {
      const mockStatusDistribution = [{ _id: "completed", count: 3 }];
      const mockRevenueOverTime = [{ _id: "2023-07-01", totalRevenue: 1000 }];
      (MongoOrder.aggregate as jest.Mock)
        .mockResolvedValueOnce(mockStatusDistribution)
        .mockResolvedValueOnce(mockRevenueOverTime);

      const result = await (widgetDataService as any).getOrderData();

      expect(result).toEqual({
        orderStatusDistribution: mockStatusDistribution,
        revenueOverTime: mockRevenueOverTime,
      });
    });
  });
});
