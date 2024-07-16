// utils/syncPostgresToMongo.ts
import Product from "../models/Product";
import Brand from "../models/Brand";
import Category from "../models/Category";
import { ProductMongoService } from "../services/productMongoService";
import { BrandMongoService } from "../services/brandMongoService";
import { CategoryMongoService } from "../services/categoryMongoService";

const productMongoService = new ProductMongoService();
const brandMongoService = new BrandMongoService();
const categoryMongoService = new CategoryMongoService();

export async function syncPostgresToMongo() {
  try {
    // Sync Brands
    const brands = await Brand.findAll();
    console.log(`Syncing ${brands.length} brands from PostgreSQL to MongoDB`);
    for (const brand of brands) {
      await brandMongoService.syncWithPostgres(brand.toJSON());
    }

    // Sync Categories
    const categories = await Category.findAll();
    console.log(
      `Syncing ${categories.length} categories from PostgreSQL to MongoDB`
    );
    for (const category of categories) {
      await categoryMongoService.syncWithPostgres(category.toJSON());
    }

    // Sync Products
    const products = await Product.findAll();
    console.log(
      `Syncing ${products.length} products from PostgreSQL to MongoDB`
    );
    for (const product of products) {
      await productMongoService.syncWithPostgres(product.toJSON());
    }

    console.log("Synchronization between PostgreSQL and MongoDB complete");
  } catch (error) {
    console.error("Error during synchronization:", error);
  }
}
