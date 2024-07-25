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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const tsoa_1 = require("tsoa");
const categoryService_1 = require("../services/categoryService");
let CategoryController = class CategoryController extends tsoa_1.Controller {
    constructor() {
        super();
        this.categoryService = new categoryService_1.CategoryService();
    }
    async getCategories() {
        return this.categoryService.getAll();
    }
    async getCategory(categoryId) {
        return this.categoryService.get(categoryId);
    }
    async createCategory(requestBody) {
        this.setStatus(201);
        return this.categoryService.create(requestBody);
    }
    async updateCategory(categoryId, requestBody) {
        return this.categoryService.update(categoryId, requestBody);
    }
    async deleteCategory(categoryId) {
        const result = await this.categoryService.delete(categoryId);
        if (!result.success) {
            this.setStatus(400);
            return result.message;
        }
        this.setStatus(204);
    }
};
exports.CategoryController = CategoryController;
__decorate([
    (0, tsoa_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getCategories", null);
__decorate([
    (0, tsoa_1.Get)("{categoryId}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getCategory", null);
__decorate([
    (0, tsoa_1.Security)("jwt", ["ROLE_ADMIN"]),
    (0, tsoa_1.SuccessResponse)("201", "Created"),
    (0, tsoa_1.Post)(),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "createCategory", null);
__decorate([
    (0, tsoa_1.Security)("jwt", ["ROLE_ADMIN"]),
    (0, tsoa_1.Put)("{categoryId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "updateCategory", null);
__decorate([
    (0, tsoa_1.Security)("jwt", ["ROLE_ADMIN"]),
    (0, tsoa_1.Delete)("{categoryId}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "deleteCategory", null);
exports.CategoryController = CategoryController = __decorate([
    (0, tsoa_1.Route)("categories"),
    __metadata("design:paramtypes", [])
], CategoryController);
