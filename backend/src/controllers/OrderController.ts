import { Body, Controller, Get, Path, Post, Route, SuccessResponse } from "tsoa";
import { OrderService } from "../services/orderService";
import { IOrder } from "../interfaces/IOrder";
import { IOrderItem } from "../interfaces/IOrderItem";
import { MongoOrderService } from "../services/mongoOrderService";

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
  private mongoOrderService: MongoOrderService = new MongoOrderService();

  /*
  @Get("{userId}")
  public async getUserOrders(@Path() userId: string): Promise<IOrder[]> {
    return this.orderService.getOrdersByUserId(userId);
  }
  */
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

  @Get("/panel/orders/{userId}")
  public async getUserOrders(@Path() userId: string): Promise<any> {
    return this.mongoOrderService.getOrdersByUserId(userId);
  }
}