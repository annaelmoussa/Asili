"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const OrderItem_1 = __importDefault(require("../models/OrderItem"));
const Product_1 = __importDefault(require("../models/Product"));
class OrderService {
    async getOrdersByUserId(userId) {
        return Order_1.default.findAll({
            where: { userId },
            include: [{
                    model: OrderItem_1.default,
                    as: 'items',
                    include: [{
                            model: Product_1.default,
                            as: 'product'
                        }]
                }]
        });
    }
    async getOrderItems(orderId) {
        const items = await OrderItem_1.default.findAll({
            where: { orderId },
            include: [{
                    model: Product_1.default,
                    as: 'product',
                    attributes: ['id', 'name', 'description', 'price', 'category', 'stock', 'image']
                }],
            attributes: ['id', 'quantity'],
            order: [
                [{ model: Product_1.default, as: 'product' }, 'name', 'ASC']
            ]
        });
        return items;
    }
    async createOrder(orderInfo, orderItems) {
        const order = await Order_1.default.create(orderInfo);
        for (const item of orderItems) {
            await OrderItem_1.default.create({
                ...item,
                orderId: order.id
            });
        }
        return this.getOrderById(order.id);
    }
    async getOrderById(orderId) {
        return Order_1.default.findByPk(orderId, {
            include: [
                {
                    model: OrderItem_1.default,
                    as: 'items',
                    include: [{ model: Product_1.default, as: 'product' }]
                }
            ]
        });
    }
    async updateOrderStatus(orderId, status) {
        await Order_1.default.update({ status }, { where: { id: orderId } });
        return this.getOrderById(orderId);
    }
}
exports.OrderService = OrderService;
