import { IOrderItem } from "./IOrderItem";
import { IPayment } from "./IPayment";
import { IShipping } from "./IShipping";

export interface IOrder {
  id?: string;
  userId: string;
  stripeInvoiceId: string;
  amount: number;
  status: string;
  shippingAddress: string;
  items?: IOrderItem[];
  shipping?: IShipping;
  payment?: IPayment;
}

export { IOrderItem };
