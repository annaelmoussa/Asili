import Product from "../models/Product";
import { IProduct, ProductCreationParams } from "../interfaces/IProduct";
import { ProductMongoService } from "./productMongoService";
import { Sequelize, Transaction } from "sequelize";
import { sequelize as defaultSequelize } from "../config/dbConfigPostgres";
import ProductMongo from "../models/ProductMongo";

const productMongoService = new ProductMongoService();

export class ProductService {
  private sequelize: Sequelize;

  constructor(sequelize?: Sequelize) {
    this.sequelize = sequelize || defaultSequelize;
  }
  public async get(
    productId: string,
    options?: { transaction?: Transaction }
  ): Promise<IProduct | null> {
    const product = await Product.findByPk(productId, options);
    return product ? product.toJSON() : null;
  }

  public async getAll(options?: {
    transaction?: Transaction;
  }): Promise<IProduct[]> {
    const products = await Product.findAll(options);
    return products.map((product) => product.toJSON());
  }

  public async create(
    productCreationParams: ProductCreationParams,
    options?: { transaction?: Transaction }
  ): Promise<IProduct> {
    console.time("create-product");
    try {
      const product = await Product.create(productCreationParams, options);
      const productData = product.toJSON();
      await productMongoService.syncWithPostgres(productData);
      return productData;
    } finally {
      console.timeEnd("create-product");
    }
  }

  public async update(
    id: string,
    updates: Partial<IProduct>,
    options?: { transaction?: Transaction }
  ): Promise<IProduct | null> {
    console.time("update-product");
    try {
      const [updatedRowsCount, [updatedProduct]] = await Product.update(
        updates,
        {
          where: { id },
          returning: true,
          ...options,
        }
      );
      if (updatedRowsCount === 0) return null;
      const productData = updatedProduct.toJSON();
      await productMongoService.syncWithPostgres(productData);
      return productData;
    } finally {
      console.timeEnd("update-product");
    }
  }

  public async delete(
    id: string,
    options?: { transaction?: Transaction }
  ): Promise<boolean> {
    console.time("delete-product");
    try {
      const deletedRowsCount = await Product.destroy({
        where: { id },
        ...options,
      });
      if (deletedRowsCount > 0) {
        await ProductMongo.deleteOne({ id });
      }
      return deletedRowsCount > 0;
    } finally {
      console.timeEnd("delete-product");
    }
  }

  public async search(query: string | undefined, facets: any): Promise<IProduct[]> {
    console.log("Searching with query:", query, "and facets:", facets);
    return productMongoService.search(query, facets);
  }
}

export default ProductService;
