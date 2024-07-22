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
exports.WidgetsController = void 0;
const tsoa_1 = require("tsoa");
const WidgetsService_1 = require("../services/WidgetsService");
let WidgetsController = class WidgetsController extends tsoa_1.Controller {
    constructor() {
        super();
        this.widgetsService = new WidgetsService_1.WidgetsService();
    }
    async getWidgets(request) {
        const user = request.user;
        return this.widgetsService.getAllByUser(user.id);
    }
    async getWidget(widgetId) {
        return this.widgetsService.getWidgetWithData(widgetId);
    }
    async createWidget(requestBody, request) {
        const user = request.user;
        return this.widgetsService.create(user.id, requestBody);
    }
    async updateWidget(widgetId, requestBody) {
        return this.widgetsService.update(widgetId, requestBody);
    }
    async deleteWidget(widgetId) {
        return this.widgetsService.delete(widgetId);
    }
    async getWidgetData(modelType) {
        return this.widgetsService.getWidgetData(modelType);
    }
};
exports.WidgetsController = WidgetsController;
__decorate([
    (0, tsoa_1.Get)(),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WidgetsController.prototype, "getWidgets", null);
__decorate([
    (0, tsoa_1.Get)("{widgetId}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WidgetsController.prototype, "getWidget", null);
__decorate([
    (0, tsoa_1.Post)(),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WidgetsController.prototype, "createWidget", null);
__decorate([
    (0, tsoa_1.Put)("{widgetId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WidgetsController.prototype, "updateWidget", null);
__decorate([
    (0, tsoa_1.Delete)("{widgetId}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WidgetsController.prototype, "deleteWidget", null);
__decorate([
    (0, tsoa_1.Get)("data/{modelType}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WidgetsController.prototype, "getWidgetData", null);
exports.WidgetsController = WidgetsController = __decorate([
    (0, tsoa_1.Route)("widgets"),
    (0, tsoa_1.Tags)("Widgets"),
    (0, tsoa_1.Security)("jwt", ["ROLE_ADMIN"]),
    __metadata("design:paramtypes", [])
], WidgetsController);
