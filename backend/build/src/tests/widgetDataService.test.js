"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WidgetDataService_1 = require("../services/WidgetDataService");
const ProductMongo_1 = __importDefault(require("../models/ProductMongo"));
const MongoOrder_1 = require("../models/MongoOrder");
const User_1 = __importDefault(require("../models/User"));
jest.mock("../models/ProductMongo");
jest.mock("../models/MongoOrder");
jest.mock("../models/User");
describe("WidgetDataService", () => {
    let widgetDataService;
    beforeEach(() => {
        widgetDataService = new WidgetDataService_1.WidgetDataService();
        jest.clearAllMocks();
    });
    describe("getDataForWidget", () => {
        it("should call getDataForModelType with the correct model type", async () => {
            const mockWidget = { modelType: "Products" };
            const spy = jest.spyOn(widgetDataService, "getDataForModelType");
            await widgetDataService.getDataForWidget(mockWidget);
            expect(spy).toHaveBeenCalledWith("Products");
        });
    });
    describe("getDataForModelType", () => {
        it('should return product data for "Products" type', async () => {
            const spy = jest.spyOn(widgetDataService, "getProductData");
            await widgetDataService.getDataForModelType("Products");
            expect(spy).toHaveBeenCalled();
        });
        it('should return user data for "Users" type', async () => {
            const spy = jest.spyOn(widgetDataService, "getUserData");
            await widgetDataService.getDataForModelType("Users");
            expect(spy).toHaveBeenCalled();
        });
        it('should return order data for "Orders" type', async () => {
            const spy = jest.spyOn(widgetDataService, "getOrderData");
            await widgetDataService.getDataForModelType("Orders");
            expect(spy).toHaveBeenCalled();
        });
        it("should throw an error for unsupported model type", async () => {
            await expect(widgetDataService.getDataForModelType("InvalidType")).rejects.toThrow("Unsupported model type: InvalidType");
        });
    });
    describe("getProductData", () => {
        it("should return price distribution and stock levels", async () => {
            const mockPriceDistribution = [{ _id: 10, count: 5 }];
            const mockStockLevels = [{ _id: 100, count: 3 }];
            ProductMongo_1.default.aggregate
                .mockResolvedValueOnce(mockPriceDistribution)
                .mockResolvedValueOnce(mockStockLevels);
            const result = await widgetDataService.getProductData();
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
            User_1.default.findAll
                .mockResolvedValueOnce(mockRoleDistribution)
                .mockResolvedValueOnce(mockConfirmationStatus);
            const result = await widgetDataService.getUserData();
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
            MongoOrder_1.MongoOrder.aggregate
                .mockResolvedValueOnce(mockStatusDistribution)
                .mockResolvedValueOnce(mockRevenueOverTime);
            const result = await widgetDataService.getOrderData();
            expect(result).toEqual({
                orderStatusDistribution: mockStatusDistribution,
                revenueOverTime: mockRevenueOverTime,
            });
        });
    });
});
