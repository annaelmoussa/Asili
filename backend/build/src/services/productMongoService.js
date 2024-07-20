"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductMongoService = void 0;
const ProductMongo_1 = __importDefault(require("../models/ProductMongo"));
const Brand_1 = __importDefault(require("../models/Brand"));
const Category_1 = __importDefault(require("../models/Category"));
class ProductMongoService {
    async syncWithPostgres(product) {
        const { brand, category, ...productData } = product;
        const brandName = brand
            ? brand.name
            : await this.getBrandName(product.brandId);
        const categoryName = category
            ? category.name
            : await this.getCategoryName(product.categoryId);
        await ProductMongo_1.default.findOneAndUpdate({ id: product.id }, {
            ...productData,
            brandName,
            categoryName,
            lowStockThreshold: product.lowStockThreshold,
            stockHistory: product.stockHistory,
        }, {
            upsert: true,
            new: true,
        });
    }
    async getBrandName(brandId) {
        const brand = await Brand_1.default.findByPk(brandId);
        return brand?.name;
    }
    async getCategoryName(categoryId) {
        const category = await Category_1.default.findByPk(categoryId);
        return category?.name;
    }
    async updateAllProductsWithBrandAndCategoryNames() {
        const products = await ProductMongo_1.default.find();
        for (const product of products) {
            const brandName = await this.getBrandName(product.brandId);
            const categoryName = await this.getCategoryName(product.categoryId);
            await ProductMongo_1.default.updateOne({ id: product.id }, { $set: { brandName, categoryName } });
        }
        console.log("All products updated with brand and category names");
    }
    async delete(id) {
        await ProductMongo_1.default.deleteOne({ id });
    }
    async search(query, facets) {
        const searchQuery = {};
        if (query) {
            searchQuery.$or = [
                { name: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } },
            ];
        }
        console.log("Facets:", facets);
        if (facets.category)
            searchQuery.categoryName = facets.category;
        if (facets.brand)
            searchQuery.brandName = facets.brand;
        if (facets.isPromotion !== undefined)
            searchQuery.isPromotion = facets.isPromotion === "true";
        if (facets.inStock === "true")
            searchQuery.stock = { $gt: 0 };
        if (facets.minPrice || facets.maxPrice) {
            searchQuery.price = {};
            if (facets.minPrice)
                searchQuery.price.$gte = parseFloat(facets.minPrice);
            if (facets.maxPrice)
                searchQuery.price.$lte = parseFloat(facets.maxPrice);
        }
        console.log("Final MongoDB search query:", JSON.stringify(searchQuery, null, 2));
        const results = await ProductMongo_1.default.find(searchQuery).lean();
        console.log("Search results:", results);
        return results;
    }
    async updateStock(productId, quantity) {
        const product = await ProductMongo_1.default.findOne({ id: productId });
        if (!product)
            return null;
        product.stock += quantity;
        product.stockHistory.push({ date: new Date(), quantity: product.stock });
        await product.save();
        return product.toObject();
    }
    async getLowStockProducts() {
        const products = await ProductMongo_1.default.find({
            $expr: { $lte: ["$stock", "$lowStockThreshold"] },
        }).lean();
        return products;
    }
    async getStockHistory(productId) {
        const product = await ProductMongo_1.default.findOne({ id: productId });
        return product ? product.stockHistory : [];
    }
}
exports.ProductMongoService = ProductMongoService;
