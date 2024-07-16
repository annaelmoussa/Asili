"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.associateOrderItem = void 0;
const sequelize_1 = require("sequelize");
const dbConfigPostgres_1 = require("../config/dbConfigPostgres");
const MongoOrder_1 = require("../models/MongoOrder");
const Order_1 = __importDefault(require("../models/Order"));
const Product_1 = __importDefault(require("../models/Product"));
class OrderItem extends sequelize_1.Model {
}
OrderItem.init({
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
    productId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Product',
            key: 'id'
        }
    },
    quantity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    priceAtPurchase: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: false
    }
}, {
    sequelize: dbConfigPostgres_1.sequelize,
    modelName: 'OrderItem',
    tableName: 'OrderItem',
    timestamps: true
});
OrderItem.afterCreate(async (orderItem, options) => {
    try {
        const order = await Order_1.default.findByPk(orderItem.orderId, {
            include: [
                {
                    model: OrderItem,
                    as: 'items',
                    include: [{ model: Product_1.default, as: 'product' }]
                }
            ]
        });
        if (order) {
            const product = await Product_1.default.findByPk(orderItem.productId);
            await MongoOrder_1.MongoOrder.findOneAndUpdate({ id: order.id }, {
                $push: {
                    items: {
                        id: orderItem.id,
                        productId: orderItem.productId,
                        productName: product?.name,
                        productDescription: product?.description,
                        priceAtPurchase: orderItem.priceAtPurchase,
                        productImage: product?.image,
                        quantity: orderItem.quantity,
                    }
                }
            }, { upsert: true, new: true });
        }
    }
    catch (error) {
        console.error('Error updating MongoOrder:', error);
    }
});
const associateOrderItem = (models) => {
    OrderItem.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order' });
    OrderItem.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
};
exports.associateOrderItem = associateOrderItem;
exports.default = OrderItem;
