import { AuthService } from "../services/authService";
import User from "../models/User";
import { TokenBlacklist } from "../models/TokenBlacklist";
import sendEmail from "./emailService";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock("../models/User");
jest.mock("../models/TokenBlacklist");
jest.mock("./emailService");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("AuthService", () => {
  let authService: AuthService;

  beforeEach(() => {
    jest.resetAllMocks();
    authService = new AuthService();
  });

  describe("login", () => {
    it("should authenticate a user and return a token", async () => {
      const mockUser = {
        id: "user1",
        email: "test@example.com",
        password: "hashedpassword",
        isConfirmed: true,
        toJSON: jest.fn().mockReturnValue({
          id: "user1",
          email: "test@example.com"
        })
      };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("token123");

      const result = await authService.login("test@example.com", "password");

      expect(result).toEqual({
        user: mockUser.toJSON(),
        token: "token123"
      });
    });

    it("should throw an error if the password is incorrect", async () => {
      User.findOne.mockResolvedValue({
        password: "hashedpassword",
        isConfirmed: true
      });
      bcrypt.compare.mockResolvedValue(false);

      await expect(authService.login("test@example.com", "wrongpassword"))
        .rejects.toThrow("Invalid credentials");
    });

    it("should throw an error if the user is not confirmed", async () => {
      User.findOne.mockResolvedValue({
        password: "hashedpassword",
        isConfirmed: false
      });
      bcrypt.compare.mockResolvedValue(true);

      await expect(authService.login("test@example.com", "password"))
        .rejects.toThrow("Please confirm your email address");
    });
  });

  describe("signup", () => {
    it("should create a new user and send a confirmation email", async () => {
      const newUser = {
        email: "new@example.com",
        password: "password"
      };
      const hashedPassword = "hashedpassword";
      bcrypt.hash.mockResolvedValue(hashedPassword);
      jwt.sign.mockReturnValue("token123");
      User.create.mockResolvedValue({
        ...newUser,
        toJSON: () => ({ ...newUser, isConfirmed: false, confirmationToken: "token123" })
      });

      const result = await authService.signup(newUser.email, newUser.password);

      expect(sendEmail).toHaveBeenCalledWith(
        newUser.email,
        "Please confirm your account",
        expect.any(String)
      );
      expect(result).toEqual({
        ...newUser,
        isConfirmed: false,
        confirmationToken: "token123"
      });
    });
  });

  describe("confirmEmail", () => {
    it("should confirm a user's email", async () => {
      const user = {
        email: "test@example.com",
        confirmationToken: "token123",
        save: jest.fn().mockResolvedValue(undefined),
        toJSON: jest.fn().mockReturnValue({ email: "test@example.com", isConfirmed: true })
      };
      jwt.verify.mockReturnValue({ email: "test@example.com" });
      User.findOne.mockResolvedValue(user);

      const result = await authService.confirmEmail("token123");

      expect(result).toEqual(user.toJSON());
      expect(user.isConfirmed).toBe(true);
      expect(user.confirmationToken).toBe("");
    });

    it("should return null if the token is invalid or expired", async () => {
      jwt.verify.mockImplementation(() => {
        throw new Error("jwt expired");
      });

      const result = await authService.confirmEmail("expiredtoken");

      expect(result).toBeNull();
    });
  });

  describe("sendPasswordResetEmail", () => {
    it("should send a password reset email if the user exists", async () => {
      const user = {
        id: "user1",
        email: "test@example.com",
        save: jest.fn().mockResolvedValue(undefined)
      };
      User.findOne.mockResolvedValue(user);
      jwt.sign.mockReturnValue("resettoken");

      await authService.sendPasswordResetEmail("test@example.com");

      expect(sendEmail).toHaveBeenCalledWith(
        "test@example.com",
        "Password Reset",
        expect.any(String),
        expect.any(String)
      );
    });

    it("should not send an email if the user does not exist", async () => {
      User.findOne.mockResolvedValue(null);

      await authService.sendPasswordResetEmail("nonexistent@example.com");

      expect(sendEmail).not.toHaveBeenCalled();
    });
  });

  describe("resetPassword", () => {
    it("should reset the password for a user with a valid token", async () => {
      const user = {
        id: "user1",
        email: "test@example.com",
        save: jest.fn().mockResolvedValue(undefined)
      };
      jwt.verify.mockReturnValue({ id: "user1", email: "test@example.com" });
      User.findOne.mockResolvedValue(user);
      bcrypt.hash.mockResolvedValue("newhashedpassword");

      await authService.resetPassword("validtoken", "newpassword", "newpassword");

      expect(user.password).toEqual("newhashedpassword");
      expect(user.save).toHaveBeenCalled();
    });

    it("should throw an error if passwords do not match", async () => {
      await expect(authService.resetPassword("validtoken", "newpassword", "differentpassword"))
        .rejects.toThrow("Passwords do not match.");
    });
  });
});
