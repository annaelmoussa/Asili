import {Body, Controller, Path, Post, Query, Route, SuccessResponse} from "tsoa";
import { PaymentService } from "../services/paymentService";
import { IProduct } from "../interfaces/IProduct";

export interface PaymentSessionRequest {
  id: string;
  product: {
    id: string;
    name: string;
    category: string;
    description: string;
    image: string;
    price: number;
    stock: number;
  };
  quantity: number;
}

@Route("payments")
export class PaymentController extends Controller {
  private paymentService: PaymentService = new PaymentService();

  @Post("create-session/{userId}")
  public async createPaymentSession(@Path() userId: string, @Body() items: PaymentSessionRequest[]): Promise<{ sessionId: string }> {
    console.log(items, userId);
    try {
      if (!items || !userId) {
        this.setStatus(400);
        return { sessionId: 'Missing required fields' };
      }

      console.log('Received items:', items);
      console.log('Received userId:', userId);

      const sessionId = await this.paymentService.createPaymentSession(items, userId);
      return { sessionId };
    } catch (error) {
      console.error('Error in createPaymentSession:', error);
      this.setStatus(500);
      return { sessionId: 'Internal server error' };
    }
  }
}