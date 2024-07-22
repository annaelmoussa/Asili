"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const User_1 = __importDefault(require("../models/User"));
const scopes_1 = require("../config/scopes");
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const Widget_1 = __importDefault(require("../models/Widget"));
const date_fns_1 = require("date-fns");
class UserService {
    async get(userId, options) {
        try {
            const user = await User_1.default.findOne({
                where: { id: userId, isDeleted: false },
                ...options,
            });
            return user ? user.toJSON() : null;
        }
        catch (error) {
            console.error("Error fetching user by ID:", error);
            throw error;
        }
    }
    async getAll(options) {
        try {
            const users = await User_1.default.findAll({
                where: { isDeleted: false },
                ...options,
            });
            return users.map((user) => user.toJSON());
        }
        catch (error) {
            console.error("Error fetching all users:", error);
            throw error;
        }
    }
    async create(user, options) {
        const t = options?.transaction || (await User_1.default.sequelize.transaction());
        try {
            const existingDeletedUser = await User_1.default.findOne({
                where: { email: user.email, isDeleted: true },
                transaction: t,
            });
            if (existingDeletedUser) {
                const newUser = await User_1.default.create({
                    ...user,
                    id: (0, uuid_1.v4)(),
                }, { transaction: t });
                if (!options?.transaction) {
                    await t.commit();
                }
                return newUser.toJSON();
            }
            else {
                if (user.role === "ROLE_ADMIN") {
                    user.scopes = scopes_1.ALL_SCOPES;
                }
                const newUser = await User_1.default.create(user, { transaction: t });
                if (!options?.transaction) {
                    await t.commit();
                }
                return newUser.toJSON();
            }
        }
        catch (error) {
            if (!options?.transaction) {
                await t.rollback();
            }
            console.error("Error creating user:", error);
            throw error;
        }
    }
    async update(userId, updateUser, options) {
        try {
            const user = await User_1.default.findOne({
                where: { id: userId, isDeleted: false },
                ...options,
            });
            if (user) {
                await user.update(updateUser, options);
                return user.toJSON();
            }
            return null;
        }
        catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    }
    async softDelete(userId, options) {
        const t = options?.transaction || (await User_1.default.sequelize.transaction());
        try {
            const user = await User_1.default.findOne({
                where: { id: userId, isDeleted: false },
                transaction: t,
            });
            if (user) {
                const anonymousEmail = `deleted-${(0, uuid_1.v4)()}@example.com`;
                const anonymousPassword = await bcrypt_1.default.hash((0, uuid_1.v4)(), 10);
                await user.update({
                    email: anonymousEmail,
                    password: anonymousPassword,
                    isDeleted: true,
                }, { transaction: t });
                await Widget_1.default.destroy({ where: { userId: user.id }, transaction: t });
            }
            if (!options?.transaction) {
                await t.commit();
            }
        }
        catch (error) {
            if (!options?.transaction) {
                await t.rollback();
            }
            console.error("Error soft deleting user:", error);
            throw error;
        }
    }
    async delete(userId, options) {
        return this.softDelete(userId, options);
    }
    async shouldChangePassword(userId) {
        const user = await User_1.default.findByPk(userId);
        if (!user) {
            console.log("User not found for userId:", userId);
            throw new Error("User not found");
        }
        const daysSinceLastChange = (0, date_fns_1.differenceInDays)(new Date(), user.lastPasswordChange);
        return daysSinceLastChange >= 60;
    }
}
exports.UserService = UserService;
