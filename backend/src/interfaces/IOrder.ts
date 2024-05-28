export interface IOrder {
  id?: string;
  userId: string; // Required
  productId: string; // Required
  quantity: number; // Required
  status: string; // Required
}
