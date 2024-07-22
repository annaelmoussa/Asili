export interface IPayment {
  id?: string;
  userId: string;
  orderId: string;
  stripePaymentId: string;
  amount: number;
  status: string;
  createdAt: Date | string;
}
