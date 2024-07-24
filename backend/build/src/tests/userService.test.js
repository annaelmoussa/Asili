"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userService_1 = require("../services/userService");
const User_1 = __importDefault(require("../models/User"));
const Widget_1 = __importDefault(require("../models/Widget"));
const scopes_1 = require("../config/scopes");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
jest.mock("../models/User");
jest.mock("../models/Widget");
jest.mock("bcrypt");
jest.mock("uuid");
jest.mock("date-fns");
describe("UserService", () => {
    let userService;
    let mockTransaction;
    beforeEach(() => {
        userService = new userService_1.UserService();
        mockTransaction = {
            commit: jest.fn(),
            rollback: jest.fn(),
        };
        User_1.default.sequelize = { transaction: jest.fn(() => mockTransaction) };
        jest.clearAllMocks();
    });
    describe("get", () => {
        it("should return a user by id", async () => {
            const mockUser = {
                id: "user1",
                email: "user1@example.com",
                toJSON: jest.fn(() => ({ id: "user1", email: "user1@example.com" })),
            };
            User_1.default.findOne.mockResolvedValue(mockUser);
            const result = await userService.get("user1");
            expect(User_1.default.findOne).toHaveBeenCalledWith({
                where: { id: "user1", isDeleted: false },
            });
            expect(result).toEqual({ id: "user1", email: "user1@example.com" });
        });
        it("should return null if user is not found", async () => {
            User_1.default.findOne.mockResolvedValue(null);
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
            User_1.default.findAll.mockResolvedValue(mockUsers);
            const result = await userService.getAll();
            expect(User_1.default.findAll).toHaveBeenCalledWith({
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
            const mockUser = {
                email: "newuser@example.com",
                password: "password",
                role: "ROLE_USER",
            };
            const mockCreatedUser = {
                ...mockUser,
                id: "newuser1",
                toJSON: jest.fn(() => ({ ...mockUser, id: "newuser1" })),
            };
            User_1.default.findOne.mockResolvedValue(null);
            User_1.default.create.mockResolvedValue(mockCreatedUser);
            uuid_1.v4.mockReturnValue("newuser1");
            const result = await userService.create(mockUser);
            expect(User_1.default.create).toHaveBeenCalledWith(mockUser, expect.any(Object));
            expect(result).toEqual({ ...mockUser, id: "newuser1" });
        });
        it("should assign ALL_SCOPES to admin users", async () => {
            const mockUser = {
                email: "admin@example.com",
                password: "password",
                role: "ROLE_ADMIN",
            };
            const mockCreatedUser = {
                ...mockUser,
                id: "admin1",
                scopes: scopes_1.ALL_SCOPES,
                toJSON: jest.fn(() => ({
                    ...mockUser,
                    id: "admin1",
                    scopes: scopes_1.ALL_SCOPES,
                })),
            };
            User_1.default.findOne.mockResolvedValue(null);
            User_1.default.create.mockResolvedValue(mockCreatedUser);
            uuid_1.v4.mockReturnValue("admin1");
            const result = await userService.create(mockUser);
            expect(User_1.default.create).toHaveBeenCalledWith({ ...mockUser, scopes: scopes_1.ALL_SCOPES }, expect.any(Object));
            expect(result).toEqual({ ...mockUser, id: "admin1", scopes: scopes_1.ALL_SCOPES });
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
            User_1.default.findOne.mockResolvedValue(mockUser);
            const result = await userService.update("user1", {
                email: "updated@example.com",
            });
            expect(mockUser.update).toHaveBeenCalledWith({ email: "updated@example.com" }, undefined);
            expect(result).toEqual({ id: "user1", email: "updated@example.com" });
        });
        it("should return null if user to update is not found", async () => {
            User_1.default.findOne.mockResolvedValue(null);
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
            User_1.default.findOne.mockResolvedValue(mockUser);
            bcrypt_1.default.hash.mockResolvedValue("hashed_password");
            uuid_1.v4.mockReturnValue("random-uuid");
            await userService.softDelete("user1");
            expect(mockUser.update).toHaveBeenCalledWith({
                email: "deleted-random-uuid@example.com",
                password: "hashed_password",
                isDeleted: true,
            }, expect.any(Object));
            expect(Widget_1.default.destroy).toHaveBeenCalledWith({
                where: { userId: "user1" },
                transaction: expect.any(Object),
            });
        });
    });
    it("should throw an error if user is not found", async () => {
        User_1.default.findByPk.mockResolvedValue(null);
        await expect(userService.shouldChangePassword("nonexistent")).rejects.toThrow("User not found");
    });
});
