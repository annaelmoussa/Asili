import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Query,
  Route,
  SuccessResponse,
} from "tsoa";
import {
  PaymentService,
  PaymentSessionRequest,
} from "../services/paymentService";
import { IPayment } from "../interfaces/IPayment";

@Route("payments")
export class PaymentController extends Controller {
  private paymentService: PaymentService = new PaymentService();

  @Post("create-session/{userId}")
  public async createPaymentSession(
    @Path() userId: string,
    @Body() items: PaymentSessionRequest[]
  ): Promise<{ sessionId: string }> {
    console.log(items, userId);
    try {
      if (!items || !userId) {
        this.setStatus(400);
        return { sessionId: "Missing required fields" };
      }

      console.log("Received items:", items);
      console.log("Received userId:", userId);

      const sessionId = await this.paymentService.createPaymentSession(
        items,
        userId
      );
      return { sessionId };
    } catch (error) {
      console.error("Error in createPaymentSession:", error);
      this.setStatus(500);
      return { sessionId: "Internal server error" };
    }
  }

  @Get()
  public async getPayments(): Promise<IPayment[]> {
    try {
      const payments = await this.paymentService.getAllPayments();
      return payments;
    } catch (error) {
      console.error("Error in getPayments:", error);
      this.setStatus(500);
      throw new Error("Internal server error");
    }
  }
}
