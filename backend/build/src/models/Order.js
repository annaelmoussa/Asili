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
const Shipping_1 = __importDefault(require("../models/Shipping"));
const Payment_1 = __importDefault(require("../models/Payment"));
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
        const orderWithDetails = await Order.findByPk(order.id, {
            include: [
                {
                    model: OrderItem_1.default,
                    as: 'items',
                    include: [{ model: Product_1.default, as: 'product' }]
                },
                {
                    model: Shipping_1.default,
                    as: 'shipping'
                },
                {
                    model: Payment_1.default,
                    as: 'payment'
                }
            ]
        });
        if (orderWithDetails) {
            await MongoOrder_1.MongoOrder.create({
                id: orderWithDetails.id,
                userId: orderWithDetails.userId,
                stripeInvoiceId: orderWithDetails.stripeInvoiceId,
                amount: orderWithDetails.amount,
                status: orderWithDetails.status,
                shippingAddress: orderWithDetails.shippingAddress,
                trackingNumber: orderWithDetails.shipping?.trackingNumber,
                items: orderWithDetails.items?.map((item) => ({
                    id: item.id,
                    productId: item.product?.id,
                    productName: item.product?.name,
                    productDescription: item.product?.description,
                    priceAtPurchase: item.priceAtPurchase,
                    productImage: item.product?.image,
                    quantity: item.quantity,
                })),
                shipping: orderWithDetails.shipping ? {
                    id: orderWithDetails.shipping.id,
                    address: orderWithDetails.shipping.address,
                    status: orderWithDetails.shipping.status,
                    trackingNumber: orderWithDetails.shipping.trackingNumber
                } : undefined,
                payment: orderWithDetails.payment ? {
                    id: orderWithDetails.payment.id,
                    stripePaymentId: orderWithDetails.payment.stripePaymentId,
                    amount: orderWithDetails.payment.amount,
                    status: orderWithDetails.payment.status
                } : undefined
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
