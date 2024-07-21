"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoOrderService = void 0;
// src/services/mongoOrderService.ts
const MongoOrder_1 = require("../models/MongoOrder");
class MongoOrderService {
    async getOrdersByUserId(userId) {
        return MongoOrder_1.MongoOrder.find({ userId }).sort({ createdAt: -1 });
    }
    async getOrderById(orderId) {
        return MongoOrder_1.MongoOrder.findOne({ id: orderId });
    }
}
exports.MongoOrderService = MongoOrderService;
