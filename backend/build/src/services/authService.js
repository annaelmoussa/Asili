"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const TokenBlacklist_1 = __importDefault(require("../models/TokenBlacklist"));
const emailService_1 = __importDefault(require("./emailService"));
const AlertService_1 = require("./AlertService");
class AuthService {
    constructor() {
        this.secret = process.env.JWT_SECRET || "your_jwt_secret";
        this.alertService = new AlertService_1.AlertService();
    }
    async login(email, password) {
        const user = await User_1.default.findOne({ where: { email } });
        if (!user || !(await bcrypt_1.default.compare(password, user.password))) {
            throw new Error("Invalid credentials");
        }
        if (!user.isConfirmed) {
            throw new Error("Please confirm your email address");
        }
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
            scopes: user.scopes,
            password: user.password,
        };
        const token = jsonwebtoken_1.default.sign(payload, this.secret, {
            expiresIn: "1h",
        });
        return { user: user.toJSON(), token };
    }
    async signup(email, password) {
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const confirmationToken = jsonwebtoken_1.default.sign({ email }, this.secret, {
            expiresIn: "1h",
        });
        const user = await User_1.default.create({
            email,
            password: hashedPassword,
            role: "ROLE_USER",
            isConfirmed: false,
            confirmationToken: confirmationToken,
        });
        await this.alertService.createAlertPreference(user.id);
        const confirmationLink = `http://localhost:3000/auth/confirm?token=${confirmationToken}`;
        await (0, emailService_1.default)(email, "Please confirm your account", `Click the following link to confirm your account: ${confirmationLink}`);
        return user.toJSON();
    }
    async confirmEmail(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.secret);
            const user = await User_1.default.findOne({
                where: { confirmationToken: token, email: decoded.email },
            });
            if (!user) {
                throw new Error("User not found");
            }
            user.isConfirmed = true;
            user.confirmationToken = ""; // Clear the token
            await user.save();
            return user.toJSON();
        }
        catch (error) {
            return null;
        }
    }
    async resendConfirmationEmail(email) {
        const user = await User_1.default.findOne({ where: { email } });
        if (!user) {
            throw new Error("User not found");
        }
        if (user.isConfirmed) {
            throw new Error("Account already confirmed");
        }
        const confirmationToken = jsonwebtoken_1.default.sign({ email: user.email }, this.secret, {
            expiresIn: "1h",
        });
        user.confirmationToken = confirmationToken;
        await user.save();
        const confirmationLink = `http://localhost:3000/auth/confirm?token=${confirmationToken}`;
        await (0, emailService_1.default)(email, "Please confirm your account", `Click the following link to confirm your account: ${confirmationLink}`);
    }
    async sendPasswordResetEmail(email) {
        const user = await User_1.default.findOne({ where: { email } });
        if (!user) {
            // If the user doesn't exist, do nothing to avoid information leaks
            return;
        }
        const token = jsonwebtoken_1.default.sign({ email: user.email, userId: user.id }, this.secret, { expiresIn: '1h' });
        const resetLink = `http://localhost:8080/reset-password?token=${token}`;
        const emailText = `Click here to reset your password: ${resetLink}`;
        const emailHtml = `<a href="${resetLink}">Click here to reset your password</a>`;
        await (0, emailService_1.default)(user.email, "Password Reset", emailText, emailHtml);
    }
    async resetPassword(token, password, confirm_password) {
        if (password !== confirm_password) {
            throw new Error("Passwords do not match.");
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.secret);
            const user = await User_1.default.findOne({ where: { id: decoded.userId, email: decoded.email } });
            if (!user) {
                throw new Error("Invalid token or user does not exist.");
            }
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            user.password = hashedPassword;
            await user.save();
        }
        catch (err) {
            throw new Error("Invalid or expired token.");
        }
    }
    async logout(token) {
        await TokenBlacklist_1.default.create({ token });
    }
    async getUser(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.secret);
            const user = await User_1.default.findByPk(decoded.id);
            return user ? user.toJSON() : null;
        }
        catch (error) {
            return null;
        }
    }
    async isTokenBlacklisted(token) {
        const blacklistedToken = await TokenBlacklist_1.default.findOne({ where: { token } });
        return !!blacklistedToken;
    }
}
exports.AuthService = AuthService;
