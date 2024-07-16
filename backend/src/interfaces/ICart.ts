export interface ICart {
  id?: string;
  userId: string;
  items?: ICartItem[];
  reservationExpires?: Date | null;
}

export interface ICartItem {
  id?: string;
  cartId: string;
  productId: string;
  quantity: number;
  reservationExpires?: Date | null;
}
