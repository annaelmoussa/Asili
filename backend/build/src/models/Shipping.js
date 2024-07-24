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
Object.defineProperty(exports, "__esModule", { value: true });
exports.associateShipping = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const MongoOrder_1 = require("./MongoOrder");
const Order_1 = __importDefault(require("./Order"));
let Shipping = class Shipping extends sequelize_typescript_1.Model {
    static async updateMongoOrder(shippingData) {
        console.log('Shipping @AfterCreate triggered');
        console.log('Shipping data:', JSON.stringify(shippingData, null, 2));
        try {
            const result = await MongoOrder_1.MongoOrder.findOneAndUpdate({ id: shippingData.orderId }, {
                $set: {
                    shipping: {
                        id: shippingData.id,
                        address: shippingData.address,
                        status: shippingData.status,
                        trackingNumber: shippingData.trackingNumber
                    },
                }
            }, { new: true });
            console.log('MongoDB update result:', JSON.stringify(result, null, 2));
        }
        catch (error) {
            console.error('Error updating MongoOrder with shipping info:', error);
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
], Shipping.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Order_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Shipping.prototype, "orderId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Order_1.default),
    __metadata("design:type", Order_1.default)
], Shipping.prototype, "order", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Shipping.prototype, "address", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Shipping.prototype, "trackingNumber", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Shipping.prototype, "status", void 0);
__decorate([
    sequelize_typescript_1.AfterCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Shipping]),
    __metadata("design:returntype", Promise)
], Shipping, "updateMongoOrder", null);
Shipping = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "Shipping",
        timestamps: true,
    })
], Shipping);
exports.default = Shipping;
const associateShipping = (models) => {
    Shipping.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order' });
};
exports.associateShipping = associateShipping;
