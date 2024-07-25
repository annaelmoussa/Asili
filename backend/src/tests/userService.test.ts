import { v4 as uuidv4 } from "uuid";
import { UserService } from "../services/userService";
import User from "../models/User";
import { IUser } from "../interfaces/IUser";
import { Transaction } from "sequelize";
import Widget from "../models/Widget";
import bcrypt from "bcrypt";

jest.mock("../models/User");
jest.mock("../models/Widget");
jest.mock("bcrypt");

describe("UserService", () => {
  let userService: UserService;
  let mockSequelize: any;

  beforeEach(() => {
    jest.resetAllMocks();
    mockSequelize = {
      transaction: jest.fn(() => ({
        commit: jest.fn(),
        rollback: jest.fn(),
      })),
      commit: jest.fn(),
      rollback: jest.fn(),
    };
    userService = new UserService();
  });

  describe("get", () => {
    it("should fetch a user by ID", async () => {
      const userId = uuidv4();
      const mockUser = {
        id: userId,
        email: "test@example.com",
        toJSON: jest.fn().mockReturnValue({ id: userId, email: "test@example.com" }),
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.get(userId);

      expect(User.findOne).toHaveBeenCalledWith({
        where: { id: userId, isDeleted: false },
        transaction: undefined,
      });
      expect(result).toEqual({ id: userId, email: "test@example.com" });
    });
  });

  describe("getAll", () => {
    it("should fetch all users", async () => {
      const mockUsers = [
        { id: uuidv4(), email: "user1@example.com", toJSON: jest.fn().mockReturnValue({ id: uuidv4(), email: "user1@example.com" }) },
        { id: uuidv4(), email: "user2@example.com", toJSON: jest.fn().mockReturnValue({ id: uuidv4(), email: "user2@example.com" }) },
      ];

      (User.findAll as jest.Mock).mockResolvedValue(mockUsers);

      const result = await userService.getAll();

      expect(User.findAll).toHaveBeenCalledWith({
        where: { isDeleted: false },
        transaction: undefined,
      });
      expect(result).toEqual([
        { id: expect.any(String), email: "user1@example.com" },
        { id: expect.any(String), email: "user2@example.com" },
      ]);
    });
  });

  describe("create", () => {
    it("should create a new user", async () => {
      const userParams = {
        username: "testuser",
        email: "test@example.com",
        password: "password123"
      };

      const mockCreatedUser = { 
        id: uuidv4(), 
        ...userParams,
        toJSON: jest.fn().mockReturnValue({ id: uuidv4(), ...userParams })
      };

      // Mock la méthode create de User
      (User.create as jest.Mock).mockResolvedValue(mockCreatedUser);

      // Appel de la méthode create
      const result = await userService.create(userParams);

      // Vérifications
      expect(mockSequelize.transaction).toHaveBeenCalled();
      expect(User.create).toHaveBeenCalledWith(
        expect.objectContaining(userParams),
        expect.objectContaining({ transaction: expect.anything() })
      );
      expect(result).toEqual(expect.objectContaining(userParams));
    });
  });

  describe("update", () => {
    it("should update a user", async () => {
      const userId = uuidv4();
      const updateData: Partial<IUser> = { email: "updated@example.com" };
      const mockUser = {
        id: userId,
        update: jest.fn().mockResolvedValue({}),
        toJSON: jest.fn().mockReturnValue({ id: userId, ...updateData }),
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.update(userId, updateData);

      expect(User.findOne).toHaveBeenCalledWith({
        where: { id: userId, isDeleted: false },
        transaction: undefined,
      });
      expect(mockUser.update).toHaveBeenCalledWith(updateData, undefined);
      expect(result).toEqual({ id: userId, ...updateData });
    });
  });

  describe("softDelete", () => {
    it("should soft delete a user", async () => {
      const userId = uuidv4();
      const mockUser = {
        id: userId,
        update: jest.fn().mockResolvedValue({}),
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
      (Widget.destroy as jest.Mock).mockResolvedValue(1);

      await userService.softDelete(userId);

      expect(User.findOne).toHaveBeenCalledWith({
        where: { id: userId, isDeleted: false },
        transaction: expect.any(Object),
      });
      expect(mockUser.update).toHaveBeenCalledWith(
        expect.objectContaining({
          email: expect.stringContaining("deleted-"),
          password: "hashedPassword",
          isDeleted: true,
        }),
        expect.any(Object)
      );
      expect(Widget.destroy).toHaveBeenCalledWith({
        where: { userId: userId },
        transaction: expect.any(Object),
      });
    });
  });

  describe("shouldChangePassword", () => {
    it("should return true if password change is needed", async () => {
      const userId = uuidv4();
      const mockUser = {
        id: userId,
        lastPasswordChange: new Date(Date.now() - 61 * 24 * 60 * 60 * 1000), // 61 days ago
      };

      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.shouldChangePassword(userId);

      expect(User.findByPk).toHaveBeenCalledWith(userId);
      expect(result).toBe(true);
    });

    it("should return false if password change is not needed", async () => {
      const userId = uuidv4();
      const mockUser = {
        id: userId,
        lastPasswordChange: new Date(Date.now() - 59 * 24 * 60 * 60 * 1000), // 59 days ago
      };

      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.shouldChangePassword(userId);

      expect(User.findByPk).toHaveBeenCalledWith(userId);
      expect(result).toBe(false);
    });
  });
});