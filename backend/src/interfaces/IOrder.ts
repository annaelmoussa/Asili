export interface IOrder {
  id?: string;
  userId: string;
  stripeInvoiceId: string;
  amount: number;
  status: string;
}
