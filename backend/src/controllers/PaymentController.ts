import { Body, Controller, Post, Route, SuccessResponse } from "tsoa";
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

  @Post("create-session")
  public async createPaymentSession(@Body() items: PaymentSessionRequest[]): Promise<{ sessionId: string }> {
    try {
      const sessionId = await this.paymentService.createPaymentSession(items);
      return { sessionId };
    } catch (error) {
      console.error('Error in createPaymentSession:', error);
      this.setStatus(500);
      return { sessionId: 'Internal server error' };
    }
  }
}