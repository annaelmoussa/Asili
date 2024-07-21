import Order from "../models/Order";
import OrderItem from "../models/OrderItem";
import { IOrder } from "../interfaces/IOrder";
import { IOrderItem } from "../interfaces/IOrderItem";
import Product from "../models/Product";
import {ICartItem} from "@/interfaces/ICartItem";
import CartItem from "@/models/CartItem";

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

  async getOrderItems(orderId: string): Promise<IOrderItem[]> {
    const items = await OrderItem.findAll({
      where: { orderId },
      include: [{
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'description', 'price', 'category', 'stock', 'image']
      }],
      attributes: ['id', 'quantity'],
      order: [
        [{ model: Product, as: 'product' }, 'name', 'ASC']
      ]
    });
    return items;
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

}