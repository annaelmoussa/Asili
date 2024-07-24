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
exports.associatePayment = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const User_1 = __importDefault(require("./User"));
const Order_1 = __importDefault(require("./Order"));
const MongoOrder_1 = require("./MongoOrder");
let Payment = class Payment extends sequelize_typescript_1.Model {
    static async updateMongoOrder(payment) {
        console.log('payment @AfterCreate');
        try {
            await MongoOrder_1.MongoOrder.findOneAndUpdate({ id: payment.orderId }, {
                $set: {
                    payment: {
                        id: payment.id,
                        stripePaymentId: payment.stripePaymentId,
                        amount: payment.amount,
                        status: payment.status
                    }
                }
            }, { new: true });
        }
        catch (error) {
            console.error('Error updating MongoOrder with payment info:', error);
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
], Payment.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Payment.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.default),
    __metadata("design:type", User_1.default)
], Payment.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Order_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Payment.prototype, "orderId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Order_1.default),
    __metadata("design:type", Order_1.default)
], Payment.prototype, "order", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Payment.prototype, "stripePaymentId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DOUBLE,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Payment.prototype, "amount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Payment.prototype, "status", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Date)
], Payment.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.AfterCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Payment]),
    __metadata("design:returntype", Promise)
], Payment, "updateMongoOrder", null);
Payment = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "Payment",
        timestamps: true,
    })
], Payment);
exports.default = Payment;
const associatePayment = (models) => {
    Payment.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Payment.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order' });
};
exports.associatePayment = associatePayment;
