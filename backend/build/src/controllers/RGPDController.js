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
exports.RGPDController = void 0;
const tsoa_1 = require("tsoa");
const RGPDService_1 = require("../services/RGPDService");
let RGPDController = class RGPDController extends tsoa_1.Controller {
    constructor() {
        super(...arguments);
        this.rgpdService = new RGPDService_1.RGPDService();
    }
    async createModule(moduleData) {
        return this.rgpdService.createModule(moduleData);
    }
    async exportModules() {
        return this.rgpdService.exportModules();
    }
    async getModule(id) {
        return this.rgpdService.getModule(id);
    }
    async getAllModules() {
        return this.rgpdService.getAllModules();
    }
    async updateModule(id, moduleData) {
        return this.rgpdService.updateModule(id, moduleData);
    }
    async deleteModule(id) {
        return this.rgpdService.deleteModule(id);
    }
};
exports.RGPDController = RGPDController;
__decorate([
    (0, tsoa_1.Security)("jwt", ["ROLE_ADMIN"]),
    (0, tsoa_1.Post)(),
    (0, tsoa_1.OperationId)("createRGPDModule"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RGPDController.prototype, "createModule", null);
__decorate([
    (0, tsoa_1.Security)("jwt", ["ROLE_ADMIN"]),
    (0, tsoa_1.Get)("export"),
    (0, tsoa_1.OperationId)("exportRGPDModules"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RGPDController.prototype, "exportModules", null);
__decorate([
    (0, tsoa_1.Get)("{id}"),
    (0, tsoa_1.OperationId)("getRGPDModule"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RGPDController.prototype, "getModule", null);
__decorate([
    (0, tsoa_1.Get)(),
    (0, tsoa_1.OperationId)("getAllRGPDModules"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RGPDController.prototype, "getAllModules", null);
__decorate([
    (0, tsoa_1.Security)("jwt", ["ROLE_ADMIN"]),
    (0, tsoa_1.Put)("{id}"),
    (0, tsoa_1.OperationId)("updateRGPDModule"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RGPDController.prototype, "updateModule", null);
__decorate([
    (0, tsoa_1.Security)("jwt", ["ROLE_ADMIN"]),
    (0, tsoa_1.Delete)("{id}"),
    (0, tsoa_1.OperationId)("deleteRGPDModule"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RGPDController.prototype, "deleteModule", null);
exports.RGPDController = RGPDController = __decorate([
    (0, tsoa_1.Route)("rgpd"),
    (0, tsoa_1.Tags)("RGPD")
], RGPDController);
