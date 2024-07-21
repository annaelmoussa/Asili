// src/services/mongoOrderService.ts
import { MongoOrder } from '../models/MongoOrder';

export class MongoOrderService {
  async getOrdersByUserId(userId: string) {
    return MongoOrder.find({ userId }).sort({ createdAt: -1 });
  }

  async getOrderById(orderId: string) {
    return MongoOrder.findOne({ id: orderId });
  }
}