import Product from "../models/Product";
import { ProductMongoService } from "../services/productMongoService";

const productMongoService = new ProductMongoService();

export async function syncPostgresToMongo() {
  try {
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
