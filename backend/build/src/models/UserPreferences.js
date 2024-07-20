"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dbConfigPostgres_1 = require("../config/dbConfigPostgres");
const User_1 = __importDefault(require("./User"));
class UserPreferences extends sequelize_1.Model {
}
UserPreferences.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    alertNewProduct: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    alertRestock: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    alertPriceChange: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    newsletterSubscription: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
}, {
    sequelize: dbConfigPostgres_1.sequelize,
    modelName: "UserPreferences",
    timestamps: true,
});
// Define associations
UserPreferences.belongsTo(User_1.default, { foreignKey: "userId", as: "user" });
exports.default = UserPreferences;
