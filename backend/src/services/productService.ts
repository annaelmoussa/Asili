import Product from "../models/Product";
import Brand from "../models/Brand";
import Category from "../models/Category";
import { IProduct, ProductCreationParams } from "../interfaces/IProduct";
import { ProductMongoService } from "./productMongoService";
import { DataTypes, Op, Sequelize, Transaction } from "sequelize";
import { sequelize as defaultSequelize } from "../config/dbConfigPostgres";
import CartItem from "../models/CartItem";
import { v4 as uuidv4 } from "uuid";

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
      // Add missing properties to match ProductAttributes
      const fullProductParams = {
        ...productCreationParams,
        id: uuidv4(), // Generate a new UUID
        stockHistory: [], // Initialize with an empty array
      };

      const product = await Product.create(fullProductParams, options);
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
    const t = options?.transaction || (await this.sequelize.transaction());

    try {
      await CartItem.destroy({
        where: { productId: id },
        transaction: t,
      });

      const deletedRowsCount = await Product.destroy({
        where: { id },
        transaction: t,
      });

      if (deletedRowsCount > 0) {
        await productMongoService.delete(id);
      }

      if (!options?.transaction) {
        await t.commit();
      }

      return deletedRowsCount > 0;
    } catch (error) {
      if (!options?.transaction) {
        await t.rollback();
      }
      throw error;
    } finally {
      console.timeEnd("delete-product");
    }
  }

  public async search(
    query: string | undefined,
    facets: {
      category?: string;
      brand?: string;
      isPromotion?: string;
      inStock?: string;
      minPrice?: string;
      maxPrice?: string;
    }
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
    return categories.map((category: { name: string }) => category.name);
  }

  public async getBrands(): Promise<string[]> {
    const brands = await Brand.findAll({
      attributes: ["name"],
      raw: true,
    });
    return brands.map((brand: { name: string }) => brand.name);
  }

  public async updateStock(
    productId: string,
    quantity: number,
    options?: { transaction?: Transaction }
  ): Promise<IProduct | null> {
    const product = await Product.findByPk(productId, options);
    if (!product) return null;

    product.stock += quantity;
    product.stockHistory.push({ date: new Date(), quantity: product.stock });

    await product.save(options);
    return product.toJSON();
  }

  public async getLowStockProducts(options?: {
    transaction?: Transaction;
  }): Promise<IProduct[]> {
    const products = await Product.findAll({
      where: {
        stock: {
          [Op.lte]: Sequelize.col("lowStockThreshold"),
        },
      },
      ...options,
    });
    return products.map((product) => product.toJSON());
  }

  public async getStockHistory(
    productId: string,
    options?: { transaction?: Transaction }
  ): Promise<{ date: Date; quantity: number }[]> {
    const product = await Product.findByPk(productId, options);
    return product ? product.stockHistory : [];
  }
}

export default ProductService;
