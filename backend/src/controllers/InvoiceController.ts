import { Body, Controller, Get, Path, Post, Route, SuccessResponse } from "tsoa";
import { InvoiceService } from "../services/invoiceService";
import { IInvoice } from "../interfaces/IInvoice";

interface InvoiceCreationRequest {
  userId: string;
  stripeInvoiceId: string;
  amount: number;
  status: string;
}

@Route("invoices")
export class InvoiceController extends Controller {
  private invoiceService: InvoiceService = new InvoiceService();

  @Get("{userId}")
  public async getUserInvoices(@Path() userId: string): Promise<IInvoice[]> {
    return this.invoiceService.getInvoicesByUserId(userId);
  }

  @SuccessResponse("201", "Invoice Created")
  @Post("create")
  public async createInvoice(@Body() requestBody: InvoiceCreationRequest): Promise<IInvoice> {
    this.setStatus(201);
    return this.invoiceService.createInvoice(requestBody);
  }
}
