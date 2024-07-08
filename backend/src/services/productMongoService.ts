import ProductMongo from "../models/ProductMongo";
import { IProduct } from "../interfaces/IProduct";

export class ProductMongoService {
  public async syncWithPostgres(product: IProduct): Promise<void> {
    await ProductMongo.findOneAndUpdate({ id: product.id }, product, {
      upsert: true,
      new: true,
    });
  }

  public async search(query: string | undefined, facets: any): Promise<IProduct[]> {
    console.log("MongoDB search with query:", query, "and facets:", facets);
    const searchQuery: any = {};
    if (query) {
      searchQuery.$text = { $search: query };
    }

    if (facets.category) searchQuery.category = facets.category;
    if (facets.brand) searchQuery.brand = facets.brand;
    if (facets.isPromotion) searchQuery.isPromotion = facets.isPromotion;
    if (facets.inStock) searchQuery.stock = { $gt: 0 };
    if (facets.minPrice || facets.maxPrice) {
      searchQuery.price = {};
      if (facets.minPrice) searchQuery.price.$gte = facets.minPrice;
      if (facets.maxPrice) searchQuery.price.$lte = facets.maxPrice;
    }
    console.log("Final MongoDB search query:", searchQuery);
    return ProductMongo.find(searchQuery);
  }
}
