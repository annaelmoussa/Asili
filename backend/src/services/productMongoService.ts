import ProductMongo, { IProductMongo } from "../models/ProductMongo";
import { IProduct } from "../interfaces/IProduct";
import { FilterQuery } from "mongoose";
import Brand from "../models/Brand";
import Category from "../models/Category";

export class ProductMongoService {
  public async syncWithPostgres(product: IProduct): Promise<void> {
    const { brand, category, ...productData } = product;

    const brandName = brand
      ? brand.name
      : await this.getBrandName(product.brandId);
    const categoryName = category
      ? category.name
      : await this.getCategoryName(product.categoryId);

    await ProductMongo.findOneAndUpdate(
      { id: product.id },
      {
        ...productData,
        brandName,
        categoryName,
        lowStockThreshold: product.lowStockThreshold,
        stockHistory: product.stockHistory,
      },
      {
        upsert: true,
        new: true,
      }
    );
  }

  private async getBrandName(brandId: string): Promise<string | undefined> {
    const brand = await Brand.findByPk(brandId);
    return brand?.name;
  }

  private async getCategoryName(
    categoryId: string
  ): Promise<string | undefined> {
    const category = await Category.findByPk(categoryId);
    return category?.name;
  }

  public async updateAllProductsWithBrandAndCategoryNames(): Promise<void> {
    const products = await ProductMongo.find();
    for (const product of products) {
      const brandName = await this.getBrandName(product.brandId);
      const categoryName = await this.getCategoryName(product.categoryId);
      await ProductMongo.updateOne(
        { id: product.id },
        { $set: { brandName, categoryName } }
      );
    }
    console.log("All products updated with brand and category names");
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
    const searchQuery: FilterQuery<IProductMongo> = {};

    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ];
    }

    console.log("Facets:", facets);

    if (facets.category) searchQuery.categoryName = facets.category;
    if (facets.brand) searchQuery.brandName = facets.brand;
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

    const results = await ProductMongo.find(searchQuery).lean();
    console.log("Search results:", results);
    return results as IProduct[];
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
    }).lean();
    return products as IProduct[];
  }

  public async getStockHistory(
    productId: string
  ): Promise<{ date: Date; quantity: number }[]> {
    const product = await ProductMongo.findOne({ id: productId });
    return product ? product.stockHistory : [];
  }
}
