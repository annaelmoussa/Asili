import Order from "../models/Order";
import OrderItem from "../models/OrderItem";
import { IOrder } from "../interfaces/IOrder";
import { IOrderItem } from "../interfaces/IOrderItem";
import Product from "../models/Product";

export class OrderService {
  async getOrdersByUserId(userId: string): Promise<IOrder[]> {
    return Order.findAll({
      where: { userId },
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product'
        }]
      }]
    });
  }

  async createOrder(orderInfo: IOrder, orderItems: any[]): Promise<IOrder | null> {
    const order = await Order.create(orderInfo);

    for (const item of orderItems) {
      await OrderItem.create({
        ...item,
        orderId: order.id
      });
    }

    return this.getOrderById(order.id);
  }

  async getOrderById(orderId: string): Promise<IOrder | null> {
    return Order.findByPk(orderId, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }]
        }
      ]
    });
  }

  async updateOrderStatus(orderId: string, status: string): Promise<IOrder | null> {
    await Order.update({ status }, { where: { id: orderId } });
    return this.getOrderById(orderId);
  }

  async updateTrackingNumber(orderId: string, trackingNumber: string): Promise<IOrder | null> {
    await Order.update({ trackingNumber }, { where: { id: orderId } });
    return this.getOrderById(orderId);
  }
}