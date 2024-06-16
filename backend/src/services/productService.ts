import { IProduct } from "../interfaces/IProduct";
import Product from "../models/Product";
import { Transaction } from "sequelize";

export type ProductCreationParams = Pick<
  IProduct,
  "name" | "description" | "price" | "category" | "stock" | "image"
>;

export class ProductService {
  public async get(
    productId: string,
    options?: { transaction?: Transaction }
  ): Promise<IProduct | null> {
    try {
      const product = await Product.findByPk(productId, options);
      return product ? product.toJSON() : null;
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      throw error;
    }
  }

  public async getAll(options?: {
    transaction?: Transaction;
  }): Promise<IProduct[]> {
    try {
      const products = await Product.findAll(options);
      return products.map((product) => product.toJSON());
    } catch (error) {
      console.error("Error fetching all products:", error);
      throw error;
    }
  }

  public async create(
    productCreationParams: ProductCreationParams,
    options?: { transaction?: Transaction }
  ): Promise<IProduct> {
    try {
      const product = await Product.create(productCreationParams, options);
      return product.toJSON();
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }
}
