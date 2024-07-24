"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const AlertService_1 = require("../services/AlertService");
const AlertPreference_1 = __importDefault(require("../models/AlertPreference"));
const User_1 = __importDefault(require("../models/User"));
const ProductSubscription_1 = __importDefault(require("../models/ProductSubscription"));
const Category_1 = __importDefault(require("../models/Category"));
const emailService_1 = __importDefault(require("../services/emailService"));
jest.mock("../models/AlertPreference");
jest.mock("../models/User");
jest.mock("../models/Product");
jest.mock("../models/ProductSubscription");
jest.mock("../models/Category");
jest.mock("../services/emailService");
describe("AlertService", () => {
    let alertService;
    beforeEach(() => {
        jest.resetAllMocks();
        alertService = new AlertService_1.AlertService();
    });
    describe("createAlertPreference", () => {
        it("should create a new alert preference for a user", async () => {
            const userId = (0, uuid_1.v4)();
            const mockAlertPreference = {
                userId,
                newProductInCategory: false,
                productRestock: false,
                priceChange: false,
                newsletter: false,
            };
            AlertPreference_1.default.create.mockResolvedValue(mockAlertPreference);
            const result = await alertService.createAlertPreference(userId);
            expect(AlertPreference_1.default.create).toHaveBeenCalledWith(mockAlertPreference);
            expect(result).toEqual(mockAlertPreference);
        });
    });
    describe("updateAlertPreference", () => {
        it("should update an existing alert preference", async () => {
            const userId = (0, uuid_1.v4)();
            const updateParams = { newProductInCategory: true, productRestock: true };
            const mockUpdatedPreference = { userId, ...updateParams };
            AlertPreference_1.default.findOne.mockResolvedValue({
                update: jest.fn().mockResolvedValue(mockUpdatedPreference),
            });
            const result = await alertService.updateAlertPreference(userId, updateParams);
            expect(AlertPreference_1.default.findOne).toHaveBeenCalledWith({
                where: { userId },
            });
            expect(result).toEqual(mockUpdatedPreference);
        });
    });
    describe("getAlertPreference", () => {
        it("should retrieve alert preferences for a user", async () => {
            const userId = (0, uuid_1.v4)();
            const mockPreference = { userId, newProductInCategory: true };
            AlertPreference_1.default.findOne.mockResolvedValue(mockPreference);
            const result = await alertService.getAlertPreference(userId);
            expect(AlertPreference_1.default.findOne).toHaveBeenCalledWith({
                where: { userId },
            });
            expect(result).toEqual(mockPreference);
        });
    });
    describe("sendNewProductAlert", () => {
        it("should send new product alerts to subscribed users", async () => {
            const mockProduct = {
                id: (0, uuid_1.v4)(),
                name: "New Product",
                category: "Electronics",
            };
            const mockUsers = [
                {
                    email: "user1@example.com",
                    alertPreferences: { newProductInCategory: true },
                },
                {
                    email: "user2@example.com",
                    alertPreferences: { newProductInCategory: true },
                },
            ];
            User_1.default.findAll.mockResolvedValue(mockUsers);
            await alertService.sendNewProductAlert(mockProduct);
            expect(User_1.default.findAll).toHaveBeenCalled();
            expect(emailService_1.default).toHaveBeenCalledTimes(2);
            expect(emailService_1.default).toHaveBeenCalledWith("user1@example.com", "New Product Alert", expect.stringContaining("New Product"));
        });
    });
    describe("sendRestockAlert", () => {
        it("should send restock alerts to subscribed users", async () => {
            const mockProduct = { id: (0, uuid_1.v4)(), name: "Restocked Product" };
            const mockSubscriptions = [
                {
                    user: {
                        email: "user1@example.com",
                        alertPreferences: { productRestock: true },
                    },
                    notifyRestock: true,
                },
            ];
            ProductSubscription_1.default.findAll.mockResolvedValue(mockSubscriptions);
            await alertService.sendRestockAlert(mockProduct);
            expect(ProductSubscription_1.default.findAll).toHaveBeenCalled();
            expect(emailService_1.default).toHaveBeenCalledWith("user1@example.com", "Product Restock Alert", expect.stringContaining("Restocked Product"));
        });
    });
    describe("sendPriceChangeAlert", () => {
        it("should send price change alerts to subscribed users", async () => {
            const mockProduct = {
                id: (0, uuid_1.v4)(),
                name: "Price Changed Product",
                price: 150,
            };
            const oldPrice = 100;
            const mockSubscriptions = [
                {
                    user: {
                        email: "user1@example.com",
                        alertPreferences: { priceChange: true },
                    },
                    notifyPriceChange: true,
                },
            ];
            ProductSubscription_1.default.findAll.mockResolvedValue(mockSubscriptions);
            await alertService.sendPriceChangeAlert(mockProduct, oldPrice);
            expect(ProductSubscription_1.default.findAll).toHaveBeenCalled();
            expect(emailService_1.default).toHaveBeenCalledWith("user1@example.com", "Price Change Alert", expect.stringContaining("Price Changed Product"));
        });
    });
    describe("sendNewProductInCategoryAlert", () => {
        it("should send new product in category alerts to subscribed users", async () => {
            const mockProduct = {
                id: (0, uuid_1.v4)(),
                name: "New Category Product",
                description: "Test description",
                price: 100,
                categoryId: (0, uuid_1.v4)(),
                brandId: (0, uuid_1.v4)(),
                stock: 10,
                lowStockThreshold: 5,
                stockHistory: [],
                isPromotion: false,
            };
            const mockCategory = { id: mockProduct.categoryId, name: "New Category" };
            const mockSubscriptions = [
                {
                    user: {
                        email: "user1@example.com",
                        alertPreferences: { newProductInCategory: true },
                    },
                    notifyNewProductInCategory: true,
                },
            ];
            Category_1.default.findByPk.mockResolvedValue(mockCategory);
            ProductSubscription_1.default.findAll.mockResolvedValue(mockSubscriptions);
            await alertService.sendNewProductInCategoryAlert(mockProduct);
            expect(Category_1.default.findByPk).toHaveBeenCalledWith(mockProduct.categoryId);
            expect(ProductSubscription_1.default.findAll).toHaveBeenCalled();
            expect(emailService_1.default).toHaveBeenCalledWith("user1@example.com", "New Product in Category Alert", expect.stringContaining("New Category Product"));
        });
    });
    describe("sendNewsletter", () => {
        it("should send newsletter to subscribed users", async () => {
            const subject = "Monthly Newsletter";
            const content = "This is the monthly newsletter content.";
            const mockUsers = [
                { email: "user1@example.com", alertPreferences: { newsletter: true } },
                { email: "user2@example.com", alertPreferences: { newsletter: true } },
            ];
            User_1.default.findAll.mockResolvedValue(mockUsers);
            await alertService.sendNewsletter(subject, content);
            expect(User_1.default.findAll).toHaveBeenCalled();
            expect(emailService_1.default).toHaveBeenCalledTimes(2);
            expect(emailService_1.default).toHaveBeenCalledWith("user1@example.com", subject, content);
            expect(emailService_1.default).toHaveBeenCalledWith("user2@example.com", subject, content);
        });
    });
});
