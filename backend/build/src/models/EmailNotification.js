"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dbConfigPostgres_1 = require("../config/dbConfigPostgres");
const User_1 = __importDefault(require("./User"));
class EmailNotification extends sequelize_1.Model {
}
EmailNotification.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    productId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
    },
    categoryId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
    },
}, {
    sequelize: dbConfigPostgres_1.sequelize,
    modelName: "EmailNotification",
    timestamps: true,
});
// Define associations
EmailNotification.belongsTo(User_1.default, { foreignKey: "userId", as: "user" });
exports.default = EmailNotification;
