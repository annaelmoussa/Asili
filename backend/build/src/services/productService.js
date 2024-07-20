"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const Brand_1 = __importDefault(require("../models/Brand"));
const Category_1 = __importDefault(require("../models/Category"));
const productMongoService_1 = require("./productMongoService");
const sequelize_1 = require("sequelize");
const dbConfigPostgres_1 = require("../config/dbConfigPostgres");
const CartItem_1 = __importDefault(require("../models/CartItem"));
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const productMongoService = new productMongoService_1.ProductMongoService();
class ProductService {
    constructor(sequelize) {
        this.sequelize = sequelize || dbConfigPostgres_1.sequelize;
    }
    async get(productId, options) {
        const product = await Product_1.default.findByPk(productId, {
            include: [{ model: Brand_1.default }, { model: Category_1.default }],
            ...options,
        });
        return product ? product.toJSON() : null;
    }
    async getAll(options) {
        const products = await Product_1.default.findAll({
            include: [{ model: Brand_1.default }, { model: Category_1.default }],
            ...options,
        });
        return products.map((product) => product.toJSON());
    }
    async create(productCreationParams, options) {
        console.time("create-product");
        try {
            const fullProductParams = {
                ...productCreationParams,
                id: (0, uuid_1.v4)(),
                stockHistory: [],
            };
            const product = await Product_1.default.create(fullProductParams, options);
            const productData = await this.get(product.id, options);
            if (productData) {
                await productMongoService.syncWithPostgres(productData);
            }
            return productData;
        }
        finally {
            console.timeEnd("create-product");
        }
    }
    async update(id, updates, options) {
        console.time("update-product");
        try {
            const existingProduct = await Product_1.default.findByPk(id);
            if (!existingProduct) {
                return null;
            }
            if (updates.image && existingProduct.image) {
                const oldImagePath = path_1.default.join(__dirname, "..", "..", existingProduct.image);
                if (fs_1.default.existsSync(oldImagePath)) {
                    fs_1.default.unlinkSync(oldImagePath);
                }
            }
            await Product_1.default.update(updates, {
                where: { id },
                ...options,
            });
            const updatedProduct = await this.get(id, options);
            if (updatedProduct) {
                await productMongoService.syncWithPostgres(updatedProduct);
            }
            return updatedProduct;
        }
        finally {
            console.timeEnd("update-product");
        }
    }
    async delete(id, options) {
        const t = options?.transaction || (await this.sequelize.transaction());
        try {
            await CartItem_1.default.destroy({
                where: { productId: id },
                transaction: t,
            });
            const deletedRowsCount = await Product_1.default.destroy({
                where: { id },
                transaction: t,
            });
            if (deletedRowsCount > 0) {
                await productMongoService.delete(id);
            }
            if (!options?.transaction) {
                await t.commit();
            }
            return deletedRowsCount > 0;
        }
        catch (error) {
            if (!options?.transaction) {
                await t.rollback();
            }
            throw error;
        }
    }
    async search(query, facets) {
        return productMongoService.search(query, facets);
    }
    async getCategories() {
        const categories = await Category_1.default.findAll({
            attributes: ["name"],
            raw: true,
        });
        return categories.map((category) => category.name);
    }
    async getBrands() {
        const brands = await Brand_1.default.findAll({
            attributes: ["name"],
            raw: true,
        });
        return brands.map((brand) => brand.name);
    }
    async updateStock(productId, quantity, options) {
        const product = await Product_1.default.findByPk(productId, options);
        if (!product)
            return null;
        product.stock += quantity;
        product.stockHistory.push({ date: new Date(), quantity: product.stock });
        await product.save(options);
        return product.toJSON();
    }
    async getLowStockProducts(options) {
        const products = await Product_1.default.findAll({
            where: {
                stock: {
                    [sequelize_1.Op.lte]: sequelize_1.Sequelize.col("lowStockThreshold"),
                },
            },
            ...options,
        });
        return products.map((product) => product.toJSON());
    }
    async getStockHistory(productId, options) {
        const product = await Product_1.default.findByPk(productId, options);
        return product ? product.stockHistory : [];
    }
}
exports.ProductService = ProductService;
exports.default = ProductService;
