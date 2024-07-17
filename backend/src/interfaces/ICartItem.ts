import { IProduct } from "../interfaces/IProduct";

export interface ICartItem {
  id?: string;
  cartId: string;
  productId: string;
  quantity: number;
  reservationExpires?: Date | null;
  product?: IProduct;
}
