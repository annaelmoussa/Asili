"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const tsoa_1 = require("tsoa");
const productService_1 = require("../services/productService");
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const AlertService_1 = require("../services/AlertService");
const Product_1 = __importDefault(require("../models/Product"));
let ProductController = class ProductController extends tsoa_1.Controller {
    constructor() {
        super();
        this.upload = (0, multer_1.default)({
            storage: multer_1.default.memoryStorage(),
            limits: {
                fileSize: 5 * 1024 * 1024,
            },
            fileFilter: (req, file, cb) => {
                if (file.mimetype.startsWith("image/")) {
                    cb(null, true);
                }
                else {
                    cb(null, false);
                    return cb(new Error("Not an image! Please upload an image."));
                }
            },
        });
        this.productService = new productService_1.ProductService();
        this.alertService = new AlertService_1.AlertService();
    }
    async saveFile(file) {
        const fileName = `${(0, uuid_1.v4)()}${path_1.default.extname(file.originalname)}`;
        const filePath = path_1.default.join(__dirname, "../../uploads/", fileName);
        try {
            if (!file.mimetype.startsWith("image/")) {
                throw new Error("Invalid file type. Only images are allowed.");
            }
            await fs_1.default.promises.writeFile(filePath, file.buffer);
            return `/uploads/${fileName}`;
        }
        catch (error) {
            console.error("Error saving file:", error);
            throw new Error("Failed to save file");
        }
    }
    async deleteFile(filePath) {
        const fullPath = path_1.default.join(__dirname, "../../", filePath);
        try {
            await fs_1.default.promises.unlink(fullPath);
        }
        catch (error) {
            console.error("Error deleting file:", error);
            throw new Error("Failed to delete file");
        }
    }
    async getLowStockProducts() {
        return this.productService.getLowStockProducts();
    }
    async getCategories() {
        return this.productService.getCategories();
    }
    async getCategoriesWithId() {
        return this.productService.getCategoriesWithId();
    }
    async getBrands() {
        return this.productService.getBrands();
    }
    async searchProducts(query, category, brand, minPrice, maxPrice, isPromotion, inStock) {
        const facets = {
            category,
            brand,
            minPrice,
            maxPrice,
            isPromotion,
            inStock,
        };
        return this.productService.search(query, facets);
    }
    async getProduct(productId) {
        return this.productService.get(productId);
    }
    async getProducts() {
        return this.productService.getAll();
    }
    async createProduct(name, description, price, categoryId, brandId, stock, isPromotion, lowStockThreshold, image) {
        const productData = {
            name,
            description,
            price,
            categoryId,
            brandId,
            stock,
            isPromotion,
            lowStockThreshold,
        };
        let imagePath;
        if (image && image.buffer) {
            try {
                imagePath = await this.saveFile(image);
            }
            catch (error) {
                console.error("Error saving image:", error);
                this.setStatus(500);
                throw new Error("Failed to save image");
            }
        }
        try {
            const product = await this.productService.create({
                ...productData,
                image: imagePath,
            });
            await this.alertService.sendNewProductInCategoryAlert(product);
            this.setStatus(201);
            return product;
        }
        catch (error) {
            if (imagePath) {
                try {
                    await this.deleteFile(imagePath);
                }
                catch (deleteError) {
                    console.error("Error deleting image after failed product creation:", deleteError);
                }
            }
            console.error("Error creating product:", error);
            this.setStatus(400);
            throw error;
        }
    }
    async updateProduct(productId, name, description, price, categoryId, brandId, stock, isPromotion, lowStockThreshold, image, existingImageUrl) {
        const updates = {};
        if (name !== undefined)
            updates.name = name;
        if (description !== undefined)
            updates.description = description;
        if (price !== undefined)
            updates.price = parseFloat(price);
        if (categoryId !== undefined)
            updates.categoryId = categoryId;
        if (brandId !== undefined)
            updates.brandId = brandId;
        if (stock !== undefined)
            updates.stock = parseInt(stock, 10);
        if (isPromotion !== undefined)
            updates.isPromotion = isPromotion === "true";
        if (lowStockThreshold !== undefined)
            updates.lowStockThreshold = parseInt(lowStockThreshold, 10);
        let newImagePath;
        if (image && image.buffer) {
            try {
                newImagePath = await this.saveFile(image);
                updates.image = newImagePath;
            }
            catch (error) {
                console.error("Error saving new image:", error);
                this.setStatus(500);
                throw new Error("Failed to save new image");
            }
        }
        else if (existingImageUrl) {
            updates.image = existingImageUrl;
        }
        try {
            const oldProduct = await this.productService.get(productId);
            const updatedProduct = await this.productService.update(productId, updates);
            if (!updatedProduct) {
                if (newImagePath) {
                    await this.deleteFile(newImagePath);
                }
                this.setStatus(404);
                return null;
            }
            if (updatedProduct) {
                const refreshedProduct = await Product_1.default.findByPk(updatedProduct.id);
                if (refreshedProduct) {
                    if (stock !== undefined && oldProduct && oldProduct.stock === 0 && refreshedProduct.stock > 0) {
                        await this.alertService.sendRestockAlert(refreshedProduct);
                    }
                    if (price !== undefined && oldProduct && oldProduct.price !== refreshedProduct.price) {
                        await this.alertService.sendPriceChangeAlert(refreshedProduct, oldProduct.price);
                    }
                }
            }
            if (newImagePath &&
                oldProduct &&
                oldProduct.image &&
                oldProduct.image !== existingImageUrl) {
                try {
                    await this.deleteFile(oldProduct.image);
                }
                catch (deleteError) {
                    console.error("Error deleting old image:", deleteError);
                }
            }
            return updatedProduct;
        }
        catch (error) {
            if (newImagePath) {
                try {
                    await this.deleteFile(newImagePath);
                }
                catch (deleteError) {
                    console.error("Error deleting new image after failed product update:", deleteError);
                }
            }
            console.error(`Error updating product ${productId}:`, error);
            this.setStatus(400);
            throw error;
        }
    }
    async deleteProduct(productId) {
        await this.productService.delete(productId);
    }
    async updateStock(productId, body) {
        return this.productService.updateStock(productId, body.quantity);
    }
    async updateLowStockThreshold(productId, body) {
        return this.productService.update(productId, {
            lowStockThreshold: body.lowStockThreshold,
        });
    }
    async getStockHistory(productId) {
        return this.productService.getStockHistory(productId);
    }
    async subscribeToProductRestock(productId, request) {
        const userId = request.user.id;
        await this.productService.subscribeToProductRestock(userId, productId);
    }
    async subscribeToProductPriceChange(productId, request) {
        const userId = request.user.id;
        await this.productService.subscribeToProductPriceChange(userId, productId);
    }
    async subscribeToCategoryNewProducts(categoryId, request) {
        const userId = request.user.id;
        await this.productService.subscribeToCategoryNewProducts(userId, categoryId);
    }
    async unsubscribeFromProductRestock(productId, request) {
        const userId = request.user.id;
        await this.productService.unsubscribeFromProductRestock(userId, productId);
    }
    async unsubscribeFromProductPriceChange(productId, request) {
        const userId = request.user.id;
        await this.productService.unsubscribeFromProductPriceChange(userId, productId);
    }
    async unsubscribeFromCategoryNewProducts(categoryId, request) {
        const userId = request.user.id;
        await this.productService.unsubscribeFromCategoryNewProducts(userId, categoryId);
    }
    async checkProductRestockSubscription(productId, request) {
        const userId = request.user.id;
        const isSubscribed = await this.productService.checkProductRestockSubscription(userId, productId);
        return { isSubscribed };
    }
    async checkProductPriceChangeSubscription(productId, request) {
        const userId = request.user.id;
        const isSubscribed = await this.productService.checkProductPriceChangeSubscription(userId, productId);
        return { isSubscribed };
    }
    async checkCategoryNewProductsSubscription(categoryId, request) {
        const userId = request.user.id;
        const isSubscribed = await this.productService.checkCategoryNewProductsSubscription(userId, categoryId);
        return { isSubscribed };
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, tsoa_1.Get)("low-stock"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getLowStockProducts", null);
__decorate([
    (0, tsoa_1.Get)("categories"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getCategories", null);
__decorate([
    (0, tsoa_1.Get)("categories-with-id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getCategoriesWithId", null);
__decorate([
    (0, tsoa_1.Get)("brands"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getBrands", null);
__decorate([
    (0, tsoa_1.Get)("search"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __param(3, (0, tsoa_1.Query)()),
    __param(4, (0, tsoa_1.Query)()),
    __param(5, (0, tsoa_1.Query)()),
    __param(6, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "searchProducts", null);
__decorate([
    (0, tsoa_1.Get)("{productId}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getProduct", null);
__decorate([
    (0, tsoa_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getProducts", null);
__decorate([
    (0, tsoa_1.SuccessResponse)("201", "Created"),
    (0, tsoa_1.Security)("jwt", ["ROLE_ADMIN"]),
    (0, tsoa_1.Post)(),
    __param(0, (0, tsoa_1.FormField)()),
    __param(1, (0, tsoa_1.FormField)()),
    __param(2, (0, tsoa_1.FormField)()),
    __param(3, (0, tsoa_1.FormField)()),
    __param(4, (0, tsoa_1.FormField)()),
    __param(5, (0, tsoa_1.FormField)()),
    __param(6, (0, tsoa_1.FormField)()),
    __param(7, (0, tsoa_1.FormField)()),
    __param(8, (0, tsoa_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, String, String, Number, Boolean, Number, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "createProduct", null);
__decorate([
    (0, tsoa_1.Put)("{productId}"),
    (0, tsoa_1.Security)("jwt", ["ROLE_ADMIN|ROLE_STORE_KEEPER"]),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.FormField)()),
    __param(2, (0, tsoa_1.FormField)()),
    __param(3, (0, tsoa_1.FormField)()),
    __param(4, (0, tsoa_1.FormField)()),
    __param(5, (0, tsoa_1.FormField)()),
    __param(6, (0, tsoa_1.FormField)()),
    __param(7, (0, tsoa_1.FormField)()),
    __param(8, (0, tsoa_1.FormField)()),
    __param(9, (0, tsoa_1.UploadedFile)()),
    __param(10, (0, tsoa_1.FormField)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, String, Object, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "updateProduct", null);
__decorate([
    (0, tsoa_1.Security)("jwt", ["ROLE_ADMIN"]),
    (0, tsoa_1.Delete)("{productId}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "deleteProduct", null);
__decorate([
    (0, tsoa_1.Security)("jwt", ["ROLE_ADMIN|ROLE_STORE_KEEPER"]),
    (0, tsoa_1.Put)("{productId}/stock"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "updateStock", null);
__decorate([
    (0, tsoa_1.Security)("jwt", ["ROLE_ADMIN|ROLE_STORE_KEEPER"]),
    (0, tsoa_1.Put)("{productId}/low-stock-threshold"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "updateLowStockThreshold", null);
__decorate([
    (0, tsoa_1.Security)("jwt", ["ROLE_ADMIN|ROLE_STORE_KEEPER"]),
    (0, tsoa_1.Get)("{productId}/stock-history"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getStockHistory", null);
__decorate([
    (0, tsoa_1.Security)("jwt"),
    (0, tsoa_1.Post)("{productId}/subscribe-restock"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "subscribeToProductRestock", null);
__decorate([
    (0, tsoa_1.Security)("jwt"),
    (0, tsoa_1.Post)("{productId}/subscribe-price-change"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "subscribeToProductPriceChange", null);
__decorate([
    (0, tsoa_1.Security)("jwt"),
    (0, tsoa_1.Post)("categories/{categoryId}/subscribe-new-products"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "subscribeToCategoryNewProducts", null);
__decorate([
    (0, tsoa_1.Security)("jwt"),
    (0, tsoa_1.Delete)("{productId}/unsubscribe-restock"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "unsubscribeFromProductRestock", null);
__decorate([
    (0, tsoa_1.Security)("jwt"),
    (0, tsoa_1.Delete)("{productId}/unsubscribe-price-change"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "unsubscribeFromProductPriceChange", null);
__decorate([
    (0, tsoa_1.Security)("jwt"),
    (0, tsoa_1.Delete)("categories/{categoryId}/unsubscribe-new-products"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "unsubscribeFromCategoryNewProducts", null);
__decorate([
    (0, tsoa_1.Security)("jwt"),
    (0, tsoa_1.Get)("{productId}/check-restock-subscription"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "checkProductRestockSubscription", null);
__decorate([
    (0, tsoa_1.Security)("jwt"),
    (0, tsoa_1.Get)("{productId}/check-price-change-subscription"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "checkProductPriceChangeSubscription", null);
__decorate([
    (0, tsoa_1.Security)("jwt"),
    (0, tsoa_1.Get)("categories/{categoryId}/check-new-products-subscription"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "checkCategoryNewProductsSubscription", null);
exports.ProductController = ProductController = __decorate([
    (0, tsoa_1.Route)("products"),
    __metadata("design:paramtypes", [])
], ProductController);
