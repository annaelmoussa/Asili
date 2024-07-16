"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.associateOrder = void 0;
const sequelize_1 = require("sequelize");
const dbConfigPostgres_1 = require("../config/dbConfigPostgres");
const MongoOrder_1 = require("./MongoOrder");
const Product_1 = __importDefault(require("./Product"));
const OrderItem_1 = __importDefault(require("./OrderItem"));
class Order extends sequelize_1.Model {
}
Order.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'User',
            key: 'id'
        }
    },
    stripeInvoiceId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    shippingAddress: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: dbConfigPostgres_1.sequelize,
    modelName: 'Order',
    tableName: 'Order',
    timestamps: true
});
Order.afterCreate(async (order, options) => {
    try {
        const orderWithItems = await Order.findByPk(order.id, {
            include: [
                {
                    model: OrderItem_1.default,
                    as: 'items',
                    include: [{ model: Product_1.default, as: 'product' }]
                }
            ]
        });
        if (orderWithItems) {
            await MongoOrder_1.MongoOrder.create({
                id: orderWithItems.id,
                userId: orderWithItems.userId,
                stripeInvoiceId: orderWithItems.stripeInvoiceId,
                amount: orderWithItems.amount,
                status: orderWithItems.status,
                shippingAddress: orderWithItems.shippingAddress,
                trackingNumber: orderWithItems.trackingNumber,
                items: orderWithItems.items?.map((item) => ({
                    id: item.id,
                    productId: item.product?.id,
                    productName: item.product?.name,
                    productDescription: item.product?.description,
                    priceAtPurchase: item.priceAtPurchase,
                    productImage: item.product?.image,
                    quantity: item.quantity,
                })),
            });
        }
    }
    catch (error) {
        console.error('Error creating MongoOrder:', error);
    }
});
const associateOrder = (models) => {
    Order.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Order.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'items' });
};
exports.associateOrder = associateOrder;
exports.default = Order;
