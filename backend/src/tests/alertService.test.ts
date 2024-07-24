import { v4 as uuidv4 } from "uuid";
import { AlertService } from "../services/AlertService";
import AlertPreference from "../models/AlertPreference";
import User from "../models/User";
import Product from "../models/Product";
import ProductSubscription from "../models/ProductSubscription";
import Category from "../models/Category";
import sendEmail from "../services/emailService";
import { IProduct } from "@/interfaces/IProduct";

jest.mock("../models/AlertPreference");
jest.mock("../models/User");
jest.mock("../models/Product");
jest.mock("../models/ProductSubscription");
jest.mock("../models/Category");
jest.mock("../services/emailService");

describe("AlertService", () => {
  let alertService: AlertService;

  beforeEach(() => {
    jest.resetAllMocks();
    alertService = new AlertService();
  });

  describe("createAlertPreference", () => {
    it("should create a new alert preference for a user", async () => {
      const userId = uuidv4();
      const mockAlertPreference = {
        userId,
        newProductInCategory: false,
        productRestock: false,
        priceChange: false,
        newsletter: false,
      };

      (AlertPreference.create as jest.Mock).mockResolvedValue(
        mockAlertPreference
      );

      const result = await alertService.createAlertPreference(userId);

      expect(AlertPreference.create).toHaveBeenCalledWith(mockAlertPreference);
      expect(result).toEqual(mockAlertPreference);
    });
  });

  describe("updateAlertPreference", () => {
    it("should update an existing alert preference", async () => {
      const userId = uuidv4();
      const updateParams = { newProductInCategory: true, productRestock: true };
      const mockUpdatedPreference = { userId, ...updateParams };

      (AlertPreference.findOne as jest.Mock).mockResolvedValue({
        update: jest.fn().mockResolvedValue(mockUpdatedPreference),
      });

      const result = await alertService.updateAlertPreference(
        userId,
        updateParams
      );

      expect(AlertPreference.findOne).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(result).toEqual(mockUpdatedPreference);
    });
  });

  describe("getAlertPreference", () => {
    it("should retrieve alert preferences for a user", async () => {
      const userId = uuidv4();
      const mockPreference = { userId, newProductInCategory: true };

      (AlertPreference.findOne as jest.Mock).mockResolvedValue(mockPreference);

      const result = await alertService.getAlertPreference(userId);

      expect(AlertPreference.findOne).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(result).toEqual(mockPreference);
    });
  });

  describe("sendNewProductAlert", () => {
    it("should send new product alerts to subscribed users", async () => {
      const mockProduct = {
        id: uuidv4(),
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

      (User.findAll as jest.Mock).mockResolvedValue(mockUsers);

      await alertService.sendNewProductAlert(mockProduct as unknown as Product);

      expect(User.findAll).toHaveBeenCalled();
      expect(sendEmail).toHaveBeenCalledTimes(2);
      expect(sendEmail).toHaveBeenCalledWith(
        "user1@example.com",
        "New Product Alert",
        expect.stringContaining("New Product")
      );
    });
  });

  describe("sendRestockAlert", () => {
    it("should send restock alerts to subscribed users", async () => {
      const mockProduct = { id: uuidv4(), name: "Restocked Product" };
      const mockSubscriptions = [
        {
          user: {
            email: "user1@example.com",
            alertPreferences: { productRestock: true },
          },
          notifyRestock: true,
        },
      ];

      (ProductSubscription.findAll as jest.Mock).mockResolvedValue(
        mockSubscriptions
      );

      await alertService.sendRestockAlert(mockProduct as Product);

      expect(ProductSubscription.findAll).toHaveBeenCalled();
      expect(sendEmail).toHaveBeenCalledWith(
        "user1@example.com",
        "Product Restock Alert",
        expect.stringContaining("Restocked Product")
      );
    });
  });

  describe("sendPriceChangeAlert", () => {
    it("should send price change alerts to subscribed users", async () => {
      const mockProduct = {
        id: uuidv4(),
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

      (ProductSubscription.findAll as jest.Mock).mockResolvedValue(
        mockSubscriptions
      );

      await alertService.sendPriceChangeAlert(mockProduct as Product, oldPrice);

      expect(ProductSubscription.findAll).toHaveBeenCalled();
      expect(sendEmail).toHaveBeenCalledWith(
        "user1@example.com",
        "Price Change Alert",
        expect.stringContaining("Price Changed Product")
      );
    });
  });

  describe("sendNewProductInCategoryAlert", () => {
    it("should send new product in category alerts to subscribed users", async () => {
      const mockProduct: IProduct = {
        id: uuidv4(),
        name: "New Category Product",
        description: "Test description",
        price: 100,
        categoryId: uuidv4(),
        brandId: uuidv4(),
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

      (Category.findByPk as jest.Mock).mockResolvedValue(mockCategory);
      (ProductSubscription.findAll as jest.Mock).mockResolvedValue(
        mockSubscriptions
      );

      await alertService.sendNewProductInCategoryAlert(mockProduct);

      expect(Category.findByPk).toHaveBeenCalledWith(mockProduct.categoryId);
      expect(ProductSubscription.findAll).toHaveBeenCalled();
      expect(sendEmail).toHaveBeenCalledWith(
        "user1@example.com",
        "New Product in Category Alert",
        expect.stringContaining("New Category Product")
      );
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

      (User.findAll as jest.Mock).mockResolvedValue(mockUsers);

      await alertService.sendNewsletter(subject, content);

      expect(User.findAll).toHaveBeenCalled();
      expect(sendEmail).toHaveBeenCalledTimes(2);
      expect(sendEmail).toHaveBeenCalledWith(
        "user1@example.com",
        subject,
        content
      );
      expect(sendEmail).toHaveBeenCalledWith(
        "user2@example.com",
        subject,
        content
      );
    });
  });
});
