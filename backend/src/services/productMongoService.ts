import ProductMongo from "../models/ProductMongo";
import { IProduct } from "../interfaces/IProduct";

export class ProductMongoService {
  public async syncWithPostgres(product: IProduct): Promise<void> {
    const { brand, category, ...productData } = product;
    await ProductMongo.findOneAndUpdate(
      { id: product.id },
      {
        ...productData,
        brandName: brand?.name,
        categoryName: category?.name,
      },
      {
        upsert: true,
        new: true,
      }
    );
  }

  public async delete(id: string): Promise<void> {
    await ProductMongo.deleteOne({ id });
  }

  public async search(
    query: string | undefined,
    facets: any
  ): Promise<IProduct[]> {
    const searchQuery: any = {};

    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ];
    }

    console.log("Facets:", facets);

    if (facets.category) searchQuery.categoryId = facets.category;
    if (facets.brand) searchQuery.brandId = facets.brand;
    if (facets.isPromotion !== undefined)
      searchQuery.isPromotion = facets.isPromotion === "true";
    if (facets.inStock === "true") searchQuery.stock = { $gt: 0 };
    if (facets.minPrice || facets.maxPrice) {
      searchQuery.price = {};
      if (facets.minPrice) searchQuery.price.$gte = parseFloat(facets.minPrice);
      if (facets.maxPrice) searchQuery.price.$lte = parseFloat(facets.maxPrice);
    }

    console.log(
      "Final MongoDB search query:",
      JSON.stringify(searchQuery, null, 2)
    );
    const results = await ProductMongo.find(searchQuery);
    console.log("Search results:", results);
    return results;
  }
}
