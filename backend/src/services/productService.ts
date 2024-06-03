import { IProduct } from "../interfaces/IProduct";
import Product from "../models/Product";

export type ProductCreationParams = Pick<
  IProduct,
  "name" | "description" | "price" | "category" | "stock"
>;

export class ProductService {
  public async get(productId: string): Promise<IProduct | null> {
    try {
      const product = await Product.findByPk(productId);
      return product ? product.toJSON() : null;
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      throw error;
    }
  }

  public async getAll(): Promise<IProduct[]> {
    try {
      const products = await Product.findAll();
      return products.map((product) => product.toJSON());
    } catch (error) {
      console.error("Error fetching all products:", error);
      throw error;
    }
  }

  public async create(
    productCreationParams: ProductCreationParams
  ): Promise<IProduct> {
    try {
      const product = await Product.create(productCreationParams);
      return product.toJSON();
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }
}
