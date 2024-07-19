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
        lowStockThreshold: product.lowStockThreshold,
        stockHistory: product.stockHistory,
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
    facets: {
      category?: string;
      brand?: string;
      isPromotion?: string;
      inStock?: string;
      minPrice?: string;
      maxPrice?: string;
    }
  ): Promise<IProduct[]> {
    const searchQuery: {
      $or?: { [key: string]: { $regex: string; $options: string } }[];
      categoryId?: string;
      brandId?: string;
      isPromotion?: boolean;
      stock?: { $gt: number };
      price?: { $gte?: number; $lte?: number };
    } = {};

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

  public async updateStock(
    productId: string,
    quantity: number
  ): Promise<IProduct | null> {
    const product = await ProductMongo.findOne({ id: productId });
    if (!product) return null;

    product.stock += quantity;
    product.stockHistory.push({ date: new Date(), quantity: product.stock });

    await product.save();
    return product.toObject();
  }

  public async getLowStockProducts(): Promise<IProduct[]> {
    const products = await ProductMongo.find({
      $expr: { $lte: ["$stock", "$lowStockThreshold"] },
    });
    return products.map((product) => product.toObject());
  }

  public async getStockHistory(
    productId: string
  ): Promise<{ date: Date; quantity: number }[]> {
    const product = await ProductMongo.findOne({ id: productId });
    return product ? product.stockHistory : [];
  }
}
