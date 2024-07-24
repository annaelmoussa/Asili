import { UserService } from "../services/userService";
import User from "../models/User";
import Widget from "../models/Widget";
import { IUser } from "../interfaces/IUser";
import { ALL_SCOPES } from "../config/scopes";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { differenceInDays } from "date-fns";

jest.mock("../models/User");
jest.mock("../models/Widget");
jest.mock("bcrypt");
jest.mock("uuid");
jest.mock("date-fns");

describe("UserService", () => {
  let userService: UserService;
  let mockTransaction: any;

  beforeEach(() => {
    userService = new UserService();
    mockTransaction = {
      commit: jest.fn(),
      rollback: jest.fn(),
    };
    (User.sequelize as any) = { transaction: jest.fn(() => mockTransaction) };
    jest.clearAllMocks();
  });

  describe("get", () => {
    it("should return a user by id", async () => {
      const mockUser = {
        id: "user1",
        email: "user1@example.com",
        toJSON: jest.fn(() => ({ id: "user1", email: "user1@example.com" })),
      };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.get("user1");

      expect(User.findOne).toHaveBeenCalledWith({
        where: { id: "user1", isDeleted: false },
      });
      expect(result).toEqual({ id: "user1", email: "user1@example.com" });
    });

    it("should return null if user is not found", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      const result = await userService.get("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("getAll", () => {
    it("should return all non-deleted users", async () => {
      const mockUsers = [
        {
          id: "user1",
          email: "user1@example.com",
          toJSON: jest.fn(() => ({ id: "user1", email: "user1@example.com" })),
        },
        {
          id: "user2",
          email: "user2@example.com",
          toJSON: jest.fn(() => ({ id: "user2", email: "user2@example.com" })),
        },
      ];
      (User.findAll as jest.Mock).mockResolvedValue(mockUsers);

      const result = await userService.getAll();

      expect(User.findAll).toHaveBeenCalledWith({
        where: { isDeleted: false },
      });
      expect(result).toEqual([
        { id: "user1", email: "user1@example.com" },
        { id: "user2", email: "user2@example.com" },
      ]);
    });
  });

  describe("create", () => {
    it("should create a new user", async () => {
      const mockUser: IUser = {
        email: "newuser@example.com",
        password: "password",
        role: "ROLE_USER",
      };
      const mockCreatedUser = {
        ...mockUser,
        id: "newuser1",
        toJSON: jest.fn(() => ({ ...mockUser, id: "newuser1" })),
      };
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue(mockCreatedUser);
      (uuidv4 as jest.Mock).mockReturnValue("newuser1");

      const result = await userService.create(mockUser);

      expect(User.create).toHaveBeenCalledWith(mockUser, expect.any(Object));
      expect(result).toEqual({ ...mockUser, id: "newuser1" });
    });

    it("should assign ALL_SCOPES to admin users", async () => {
      const mockUser: IUser = {
        email: "admin@example.com",
        password: "password",
        role: "ROLE_ADMIN",
      };
      const mockCreatedUser = {
        ...mockUser,
        id: "admin1",
        scopes: ALL_SCOPES,
        toJSON: jest.fn(() => ({
          ...mockUser,
          id: "admin1",
          scopes: ALL_SCOPES,
        })),
      };
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue(mockCreatedUser);
      (uuidv4 as jest.Mock).mockReturnValue("admin1");

      const result = await userService.create(mockUser);

      expect(User.create).toHaveBeenCalledWith(
        { ...mockUser, scopes: ALL_SCOPES },
        expect.any(Object)
      );
      expect(result).toEqual({ ...mockUser, id: "admin1", scopes: ALL_SCOPES });
    });
  });

  describe("update", () => {
    it("should update an existing user", async () => {
      const mockUser = {
        id: "user1",
        email: "user1@example.com",
        update: jest.fn(),
        toJSON: jest.fn(() => ({ id: "user1", email: "updated@example.com" })),
      };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.update("user1", {
        email: "updated@example.com",
      });

      expect(mockUser.update).toHaveBeenCalledWith(
        { email: "updated@example.com" },
        undefined
      );
      expect(result).toEqual({ id: "user1", email: "updated@example.com" });
    });

    it("should return null if user to update is not found", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      const result = await userService.update("nonexistent", {
        email: "updated@example.com",
      });

      expect(result).toBeNull();
    });
  });

  describe("softDelete", () => {
    it("should soft delete a user", async () => {
      const mockUser = {
        id: "user1",
        email: "user1@example.com",
        update: jest.fn(),
      };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed_password");
      (uuidv4 as jest.Mock).mockReturnValue("random-uuid");

      await userService.softDelete("user1");

      expect(mockUser.update).toHaveBeenCalledWith(
        {
          email: "deleted-random-uuid@example.com",
          password: "hashed_password",
          isDeleted: true,
        },
        expect.any(Object)
      );
      expect(Widget.destroy).toHaveBeenCalledWith({
        where: { userId: "user1" },
        transaction: expect.any(Object),
      });
    });
  });

  it("should throw an error if user is not found", async () => {
    (User.findByPk as jest.Mock).mockResolvedValue(null);

    await expect(
      userService.shouldChangePassword("nonexistent")
    ).rejects.toThrow("User not found");
  });
});
