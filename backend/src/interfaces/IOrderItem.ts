export interface IOrderItem {
  id?: string;
  orderId?: string;
  productId: string;
  quantity: number;
  priceAtPurchase: number;
}