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
exports.BrandController = void 0;
const tsoa_1 = require("tsoa");
const brandService_1 = require("../services/brandService");
const HttpError_1 = require("../types/HttpError");
let BrandController = class BrandController extends tsoa_1.Controller {
    constructor() {
        super();
        this.brandService = new brandService_1.BrandService();
    }
    async getBrands() {
        return this.brandService.getAll();
    }
    async getBrand(brandId) {
        return this.brandService.get(brandId);
    }
    async createBrand(requestBody) {
        this.setStatus(201);
        return this.brandService.create(requestBody);
    }
    async updateBrand(brandId, requestBody) {
        console.log("Updating brand:", brandId, "with body:", JSON.stringify(requestBody));
        try {
            const updatedBrand = await this.brandService.update(brandId, requestBody);
            console.log("Brand updated successfully:", JSON.stringify(updatedBrand));
            return updatedBrand;
        }
        catch (error) {
            console.error("Error in updateBrand controller:", error);
            if (error instanceof HttpError_1.HttpError) {
                throw error;
            }
            throw new HttpError_1.HttpError(500, "Error updating brand");
        }
    }
    async deleteBrand(brandId) {
        const result = await this.brandService.delete(brandId);
        if (!result.success) {
            this.setStatus(400);
            return result.message;
        }
        this.setStatus(204);
    }
};
exports.BrandController = BrandController;
__decorate([
    (0, tsoa_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BrandController.prototype, "getBrands", null);
__decorate([
    (0, tsoa_1.Get)("{brandId}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BrandController.prototype, "getBrand", null);
__decorate([
    (0, tsoa_1.SuccessResponse)("201", "Created"),
    (0, tsoa_1.Security)("jwt", ["ROLE_ADMIN"]),
    (0, tsoa_1.Post)(),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BrandController.prototype, "createBrand", null);
__decorate([
    (0, tsoa_1.Security)("jwt", ["ROLE_ADMIN"]),
    (0, tsoa_1.Put)("{brandId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BrandController.prototype, "updateBrand", null);
__decorate([
    (0, tsoa_1.Security)("jwt", ["ROLE_ADMIN"]),
    (0, tsoa_1.Delete)("{brandId}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BrandController.prototype, "deleteBrand", null);
exports.BrandController = BrandController = __decorate([
    (0, tsoa_1.Route)("brands"),
    __metadata("design:paramtypes", [])
], BrandController);
