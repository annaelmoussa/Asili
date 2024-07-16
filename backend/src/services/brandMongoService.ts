import BrandMongo from "../models/BrandMongo";
import { IBrand } from "../interfaces/IBrand";

export class BrandMongoService {
  public async syncWithPostgres(brand: IBrand): Promise<void> {
    try {
      await BrandMongo.findOneAndUpdate({ id: brand.id }, brand, {
        upsert: true,
        new: true,
      });
      console.log("Brand synced with MongoDB:", brand.id);
    } catch (error) {
      console.error("Error syncing brand with MongoDB:", error);
      throw error;
    }
  }
}
