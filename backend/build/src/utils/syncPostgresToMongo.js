"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncPostgresToMongo = syncPostgresToMongo;
// utils/syncPostgresToMongo.ts
const Product_1 = __importDefault(require("../models/Product"));
const Brand_1 = __importDefault(require("../models/Brand"));
const Category_1 = __importDefault(require("../models/Category"));
const productMongoService_1 = require("../services/productMongoService");
const brandMongoService_1 = require("../services/brandMongoService");
const categoryMongoService_1 = require("../services/categoryMongoService");
const productMongoService = new productMongoService_1.ProductMongoService();
const brandMongoService = new brandMongoService_1.BrandMongoService();
const categoryMongoService = new categoryMongoService_1.CategoryMongoService();
async function syncPostgresToMongo() {
    try {
        // Sync Brands
        const brands = await Brand_1.default.findAll();
        console.log(`Syncing ${brands.length} brands from PostgreSQL to MongoDB`);
        for (const brand of brands) {
            await brandMongoService.syncWithPostgres(brand.toJSON());
        }
        // Sync Categories
        const categories = await Category_1.default.findAll();
        console.log(`Syncing ${categories.length} categories from PostgreSQL to MongoDB`);
        for (const category of categories) {
            await categoryMongoService.syncWithPostgres(category.toJSON());
        }
        // Sync Products
        const products = await Product_1.default.findAll();
        console.log(`Syncing ${products.length} products from PostgreSQL to MongoDB`);
        for (const product of products) {
            await productMongoService.syncWithPostgres(product.toJSON());
        }
        console.log("Synchronization between PostgreSQL and MongoDB complete");
    }
    catch (error) {
        console.error("Error during synchronization:", error);
    }
}
