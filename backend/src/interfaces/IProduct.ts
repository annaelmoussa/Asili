export interface IProduct {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
  brand?: string;
  isPromotion?: boolean;
}

export interface ProductCreationParams {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
  brand?: string;
  isPromotion?: boolean;
}
