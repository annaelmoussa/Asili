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
var OrderItem_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.associateOrderItem = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const MongoOrder_1 = require("./MongoOrder");
const Order_1 = __importDefault(require("./Order"));
const Product_1 = __importDefault(require("./Product"));
let OrderItem = OrderItem_1 = class OrderItem extends sequelize_typescript_1.Model {
    static async updateMongoOrder(orderItem) {
        try {
            const itemWithProduct = await OrderItem_1.findByPk(orderItem.id, {
                include: [{ model: Product_1.default, as: 'product' }]
            });
            if (itemWithProduct && itemWithProduct.product) {
                await MongoOrder_1.MongoOrder.findOneAndUpdate({ id: orderItem.orderId }, {
                    $push: {
                        items: {
                            id: itemWithProduct.id,
                            productId: itemWithProduct.productId,
                            productName: itemWithProduct.product.name,
                            productDescription: itemWithProduct.product.description,
                            priceAtPurchase: itemWithProduct.priceAtPurchase,
                            productImage: itemWithProduct.product.image,
                            quantity: itemWithProduct.quantity,
                        }
                    }
                }, { new: true });
            }
        }
        catch (error) {
            console.error('Error updating MongoOrder with new order item:', error);
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
], OrderItem.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Order_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], OrderItem.prototype, "orderId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Product_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], OrderItem.prototype, "productId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], OrderItem.prototype, "quantity", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DOUBLE,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], OrderItem.prototype, "priceAtPurchase", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Order_1.default),
    __metadata("design:type", Order_1.default)
], OrderItem.prototype, "order", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Product_1.default),
    __metadata("design:type", Product_1.default)
], OrderItem.prototype, "product", void 0);
__decorate([
    sequelize_typescript_1.AfterCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [OrderItem]),
    __metadata("design:returntype", Promise)
], OrderItem, "updateMongoOrder", null);
OrderItem = OrderItem_1 = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "OrderItem",
        timestamps: true,
    })
], OrderItem);
exports.default = OrderItem;
const associateOrderItem = (models) => {
    OrderItem.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order' });
    OrderItem.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
};
exports.associateOrderItem = associateOrderItem;
