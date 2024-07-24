"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var Order_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.associateOrder = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const MongoOrder_1 = require("./MongoOrder");
const User_1 = __importDefault(require("./User"));
const Product_1 = __importDefault(require("./Product"));
const OrderItem_1 = __importDefault(require("./OrderItem"));
const Shipping_1 = __importDefault(require("./Shipping"));
const Payment_1 = __importDefault(require("./Payment"));
let Order = Order_1 = class Order extends sequelize_typescript_1.Model {
    static async createMongoOrder(order, options) {
        console.log('Order @AfterCreate');
        try {
            console.log('Order created:', order.toJSON());
            const orderWithDetails = await Order_1.findByPk(order.id, {
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
                ],
                transaction: options.transaction
            });
            console.log('Order with details:', orderWithDetails?.toJSON());
            if (orderWithDetails) {
                await MongoOrder_1.MongoOrder.create({
                    id: orderWithDetails.id,
                    userId: orderWithDetails.userId,
                    stripeInvoiceId: orderWithDetails.stripeInvoiceId,
                    amount: orderWithDetails.amount,
                    status: orderWithDetails.status,
                    createdAt: orderWithDetails.createdAt,
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
    }
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], Order.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Order.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.default),
    __metadata("design:type", User_1.default)
], Order.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Order.prototype, "stripeInvoiceId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DOUBLE,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Order.prototype, "amount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Order.prototype, "shippingAddress", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Order.prototype, "trackingNumber", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => OrderItem_1.default),
    __metadata("design:type", Array)
], Order.prototype, "items", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => Shipping_1.default),
    __metadata("design:type", Shipping_1.default)
], Order.prototype, "shipping", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => Payment_1.default),
    __metadata("design:type", Payment_1.default)
], Order.prototype, "payment", void 0);
__decorate([
    sequelize_typescript_1.AfterCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Order, Object]),
    __metadata("design:returntype", Promise)
], Order, "createMongoOrder", null);
Order = Order_1 = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "Order",
        timestamps: true,
    })
], Order);
exports.default = Order;
const associateOrder = (models) => {
    Order.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Order.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'items' });
};
exports.associateOrder = associateOrder;
