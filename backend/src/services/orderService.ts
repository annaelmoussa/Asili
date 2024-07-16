import Order from "../models/Order";
import { IOrder } from "../interfaces/IOrder";

export class OrderService {
  async getOrdersByUserId(userId: string): Promise<IOrder[]> {
    return Order.findAll({
      where: { userId }
    });
  }

  async createOrder(orderInfo: IOrder): Promise<IOrder> {
    return Order.create(orderInfo);
  }
}
