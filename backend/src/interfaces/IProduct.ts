import { IBrand } from "./IBrand";
import { ICategory } from "./ICategory";

export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  brandId: string;
  stock: number;
  image?: string;
  isPromotion: boolean;
  brand?: IBrand;
  category?: ICategory;
  brandName?: string; 
  categoryName?: string;
}

export interface ProductCreationParams {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  brandId: string;
  stock: number;
  image?: string;
  isPromotion: boolean;
}

export interface ProductAttributes extends IProduct {
  id: string;
}
