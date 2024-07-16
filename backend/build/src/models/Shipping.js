"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dbConfigPostgres_1 = require("../config/dbConfigPostgres");
class Shipping extends sequelize_1.Model {
    static associate(models) {
        Shipping.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order' });
    }
}
Shipping.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    orderId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Order',
            key: 'id'
        }
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    trackingNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: dbConfigPostgres_1.sequelize,
    modelName: 'Shipping',
    tableName: 'Shipping',
    timestamps: true
});
exports.default = Shipping;
