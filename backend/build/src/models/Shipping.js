"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dbConfigPostgres_1 = require("../config/dbConfigPostgres");
const MongoOrder_1 = require("./MongoOrder");
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
Shipping.afterCreate(async (shipping, options) => {
    try {
        await MongoOrder_1.MongoOrder.findOneAndUpdate({ id: shipping.orderId }, {
            $set: {
                shipping: {
                    id: shipping.id,
                    address: shipping.address,
                    status: shipping.status,
                    trackingNumber: shipping.trackingNumber
                },
                trackingNumber: shipping.trackingNumber
            }
        }, { new: true });
    }
    catch (error) {
        console.error('Error updating MongoOrder with shipping info:', error);
    }
});
exports.default = Shipping;
