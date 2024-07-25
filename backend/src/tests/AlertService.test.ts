import { v4 as uuidv4 } from "uuid";
import { AlertService } from "../services/AlertService";
import AlertPreference from "../models/AlertPreference";
import User from "../models/User";
import Product from "../models/Product";
import Category from "../models/Category";
import sendEmail from "../services/emailService";

// Ensure that all necessary modules are properly mocked
jest.mock("../models/AlertPreference");
jest.mock("../models/User");
jest.mock("../models/Product");
jest.mock("../services/emailService");

// Define the type for the mock to clear TypeScript errors
const mockedAlertPreference = AlertPreference as jest.Mocked<typeof AlertPreference>;
const mockedUser = User as jest.Mocked<typeof User>;

describe("AlertService", () => {
  let alertService: AlertService;
  let mockSequelize: any;

  beforeEach(() => {
    jest.resetAllMocks();
    mockSequelize = {
      transaction: jest.fn(() => ({
        commit: jest.fn(),
        rollback: jest.fn(),
      })),
    };
    alertService = new AlertService(mockSequelize);
  });

  describe("createAlertPreference", () => {
    it("should create alert preferences for a user", async () => {
      const userId = uuidv4();
      const mockPreference = {
        id: uuidv4(),
        userId,
        newProductInCategory: false,
        productRestock: false,
        priceChange: false,
        newsletter: false,
        toJSON: jest.fn(() => ({
          id: uuidv4(),
          userId,
          newProductInCategory: false,
          productRestock: false,
          priceChange: false,
          newsletter: false,
        })),
      };

      mockedAlertPreference.create.mockResolvedValue(mockPreference as any);

      const result = await alertService.createAlertPreference(userId);

      expect(AlertPreference.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId,
          newProductInCategory: false,
          productRestock: false,
          priceChange: false,
          newsletter: false,
        })
      );
      expect(result).toEqual(expect.objectContaining({
        userId,
        newProductInCategory: false,
        productRestock: false,
        priceChange: false,
        newsletter: false,
      }));
    });
  });

  describe("updateAlertPreference", () => {
    it("should update alert preferences for a user", async () => {
      const userId = uuidv4();
      const preferencesToUpdate = { newProductInCategory: true };
      const mockPreference = {
        id: uuidv4(),
        userId,
        update: jest.fn().mockResolvedValue({ ...preferencesToUpdate }),
        toJSON: jest.fn(() => ({ id: uuidv4(), userId, ...preferencesToUpdate })),
      };

      mockedAlertPreference.findOne.mockResolvedValue(mockPreference as any);

      const result = await alertService.updateAlertPreference(userId, preferencesToUpdate);

      expect(AlertPreference.findOne).toHaveBeenCalledWith({ where: { userId } });
      expect(mockPreference.update).toHaveBeenCalledWith(preferencesToUpdate);
      expect(result).toEqual(expect.objectContaining({ ...preferencesToUpdate }));
    });

    it("should return null if preferences do not exist", async () => {
      const userId = uuidv4();
      mockedAlertPreference.findOne.mockResolvedValue(null);

      const result = await alertService.updateAlertPreference(userId, { newProductInCategory: true });

      expect(result).toBeNull();
    });
  });

  describe("getAlertPreference", () => {
    it("should retrieve alert preferences for a user", async () => {
      const userId = uuidv4();
      const mockPreference = {
        id: uuidv4(),
        userId,
        newProductInCategory: true,
        toJSON: jest.fn(() => ({ id: uuidv4(), userId, newProductInCategory: true })),
      };

      mockedAlertPreference.findOne.mockResolvedValue(mockPreference as any);

      const result = await alertService.getAlertPreference(userId);

      expect(AlertPreference.findOne).toHaveBeenCalledWith({ where: { userId } });
      expect(result).toEqual(expect.objectContaining({ userId, newProductInCategory: true }));
    });
  });

//   describe("sendNewProductAlert", () => {
//     it("should send an email alert for new products", async () => {
//       const mockProduct: Partial<Product> = {
//         id: uuidv4(),
//         name: "Super Widget",
//         category: { name: "Widgets" } as Category,
//         toJSON: jest.fn(() => ({
//           id: uuidv4(),
//           name: "Super Widget",
//           category: { name: "Widgets" },
//         })),
//       };
//       const mockUsers = [{ id: uuidv4(), email: "test@example.com" }];
//       mockedUser.findAll.mockResolvedValue(mockUsers as any);

//       await alertService.sendNewProductAlert(mockProduct as Product);

//       // Log the category name to ensure it's correctly set
//       const categoryName = mockProduct.category?.name || "the specified category";
//       console.log(`Category Name: ${categoryName.name}`);  // This will log the category name or fallback

//       expect(sendEmail).toHaveBeenCalledWith(
//         "test@example.com",
//         "New Product Alert",
//         `A new product "${mockProduct.name}" has been added to the ${categoryName} category.`
//       );
//     });
// });


  // Additional test cases for sendRestockAlert, sendPriceChangeAlert, and sendNewsletterAlert can be similarly structured.
});
