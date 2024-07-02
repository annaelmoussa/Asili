import Invoice from "../models/Invoice";
import { IInvoice } from "../interfaces/IInvoice";

export class InvoiceService {
  async getInvoicesByUserId(userId: string): Promise<IInvoice[]> {
    return Invoice.findAll({
      where: { userId }
    });
  }

  async createInvoice(invoiceInfo: IInvoice): Promise<IInvoice> {
    return Invoice.create(invoiceInfo);
  }
}
