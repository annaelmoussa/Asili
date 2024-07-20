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
class AuthService {
    constructor() {
        this.secret = process.env.JWT_SECRET || "your_jwt_secret";
    }
    async login(email, password) {
        const user = await User_1.default.findOne({ where: { email } });
        if (!user || !(await bcrypt_1.default.compare(password, user.password))) {
            throw new Error("Invalid credentials");
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
        const user = await User_1.default.create({
            email,
            password: hashedPassword,
            role: "ROLE_USER",
            isConfirmed: false,
        });
        return user.toJSON();
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
