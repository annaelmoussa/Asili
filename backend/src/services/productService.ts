import Product from "../models/Product";
import Brand from "../models/Brand";
import Category from "../models/Category";
import { IProduct, ProductCreationParams } from "../interfaces/IProduct";
import { ProductMongoService } from "./productMongoService";
import { Sequelize, Transaction } from "sequelize";
import { sequelize as defaultSequelize } from "../config/dbConfigPostgres";

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
    const product = await Product.findByPk(productId, {
      include: [{ model: Brand }, { model: Category }],
      ...options,
    });
    return product ? product.toJSON() : null;
  }

  public async getAll(options?: {
    transaction?: Transaction;
  }): Promise<IProduct[]> {
    console.time("get-all-products");
    const products = await Product.findAll({
      include: [{ model: Brand }, { model: Category }],
      ...options,
    });
    console.log("Products fetched:", JSON.stringify(products, null, 2));
    return products.map((product) => product.toJSON());
  }

  public async create(
    productCreationParams: ProductCreationParams,
    options?: { transaction?: Transaction }
  ): Promise<IProduct> {
    console.time("create-product");
    try {
      const product = await Product.create(
        productCreationParams as any,
        options
      );
      const productData = await this.get(product.id, options);
      if (productData) {
        await productMongoService.syncWithPostgres(productData);
      }
      return productData!;
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
      await Product.update(updates, {
        where: { id },
        ...options,
      });
      const updatedProduct = await this.get(id, options);
      if (updatedProduct) {
        await productMongoService.syncWithPostgres(updatedProduct);
      }
      return updatedProduct;
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
        await productMongoService.delete(id);
      }
      return deletedRowsCount > 0;
    } finally {
      console.timeEnd("delete-product");
    }
  }

  public async search(
    query: string | undefined,
    facets: any
  ): Promise<IProduct[]> {
    console.log("Searching with query:", query, "and facets:", facets);
    return productMongoService.search(query, facets);
  }

  public async getCategories(): Promise<string[]> {
    console.log("Getting categories");
    const categories = await Category.findAll({
      attributes: ["name"],
      raw: true,
    });
    return categories.map((category) => category.name);
  }

  public async getBrands(): Promise<string[]> {
    const brands = await Brand.findAll({
      attributes: ["name"],
      raw: true,
    });
    return brands.map((brand) => brand.name);
  }
}

export default ProductService;
