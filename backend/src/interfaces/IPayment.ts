export interface IPayment {
  id?: string;
  userId: string;
  stripePaymentId: string;
  amount: number;
  status: string;
}