import { IOrderItem } from "../interfaces/IOrderItem";

export interface IOrder {
  id?: string;
  userId: string;
  stripeInvoiceId: string;
  amount: number;
  status: string;
  shippingAddress: string;
  items?: IOrderItem[];
}