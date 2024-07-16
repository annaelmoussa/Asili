import { Body, Controller, Get, Path, Post, Route, SuccessResponse } from "tsoa";
import { OrderService } from "../services/orderService";
import { IOrder } from "../interfaces/IOrder";

interface OrderCreationRequest {
  userId: string;
  stripeInvoiceId: string;
  amount: number;
  status: string;
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
  public async createOrder(@Body() requestBody: OrderCreationRequest): Promise<IOrder> {
    this.setStatus(201);
    return this.orderService.createOrder(requestBody);
  }
}
