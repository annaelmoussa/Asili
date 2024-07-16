import CategoryMongo from "../models/CategoryMongo";
import { ICategory } from "../interfaces/ICategory";

export class CategoryMongoService {
  public async syncWithPostgres(category: ICategory): Promise<void> {
    await CategoryMongo.findOneAndUpdate({ id: category.id }, category, {
      upsert: true,
      new: true,
    });
  }
}
