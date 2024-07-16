import BrandMongo from "../models/BrandMongo";
import { IBrand } from "../interfaces/IBrand";

export class BrandMongoService {
  public async syncWithPostgres(brand: IBrand): Promise<void> {
    await BrandMongo.findOneAndUpdate({ id: brand.id }, brand, {
      upsert: true,
      new: true,
    });
  }
}
