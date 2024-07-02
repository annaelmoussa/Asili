export interface IInvoice {
  id?: string;
  userId: string;
  stripeInvoiceId: string;
  amount: number;
  status: string;
}
