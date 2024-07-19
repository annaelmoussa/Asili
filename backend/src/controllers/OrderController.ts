import { Body, Controller, Get, Path, Post, Route, SuccessResponse } from "tsoa";
import { OrderService } from "../services/orderService";
import { IOrder } from "../interfaces/IOrder";
import { IOrderItem } from "../interfaces/IOrderItem";

interface OrderCreationRequest {
  userId: string;
  stripeInvoiceId: string;
  amount: number;
  status: string;
  shippingAddress: string;
  items: {
    productId: string;
    quantity: number;
    priceAtPurchase: number;
  }[];
}

@Route("orders")
export class OrderController extends Controller {
  private orderService: OrderService = new OrderService();

  @Get("{userId}")
  public async getUserOrders(@Path() userId: string): Promise<IOrder[]> {
    return this.orderService.getOrdersByUserId(userId);
  }

  @SuccessResponse("201", "Order Created")
  @Post("create")
  public async createOrder(@Body() requestBody: OrderCreationRequest): Promise<IOrder | null> {
    this.setStatus(201);
    const { items, ...orderInfo } = requestBody;
    return this.orderService.createOrder(orderInfo, items);
  }

  @Get("order/{orderId}")
  public async getOrder(@Path() orderId: string): Promise<IOrder | null> {
    return this.orderService.getOrderById(orderId);
  }

  @Post("update-status/{orderId}")
  public async updateOrderStatus(@Path() orderId: string, @Body() status: string): Promise<IOrder | null> {
    return this.orderService.updateOrderStatus(orderId, status);
  }

  @Post("update-tracking/{orderId}")
  public async updateTrackingNumber(@Path() orderId: string, @Body() trackingNumber: string): Promise<IOrder | null> {
    return this.orderService.updateTrackingNumber(orderId, trackingNumber);
  }
}