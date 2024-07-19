export interface IShipping {
  id?: string;
  orderId: string;
  address: string;
  trackingNumber?: string;
  status: string;
}