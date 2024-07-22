import { MongoOrder } from '../models/MongoOrder';
import {OrderService} from "../services/orderService";

export class MongoOrderService {
  async getOrdersByUserId(userId: string) {
    return MongoOrder.find({ userId }).sort({ createdAt: -1 });
  }

  async getOrderById(orderId: string) {
    return MongoOrder.findOne({ id: orderId });
  }
}