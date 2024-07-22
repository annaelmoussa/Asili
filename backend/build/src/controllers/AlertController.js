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
exports.AlertController = void 0;
const tsoa_1 = require("tsoa");
const AlertService_1 = require("../services/AlertService");
let AlertController = class AlertController extends tsoa_1.Controller {
    constructor() {
        super();
        this.alertService = new AlertService_1.AlertService();
    }
    async getAlertPreferences(request) {
        const userId = request.user.id;
        return this.alertService.getAlertPreference(userId);
    }
    async updateAlertPreferences(request, preferences) {
        const userId = request.user.id;
        console.log("Received preferences:", JSON.stringify(preferences));
        return this.alertService.updateAlertPreference(userId, preferences);
    }
};
exports.AlertController = AlertController;
__decorate([
    (0, tsoa_1.Security)("jwt"),
    (0, tsoa_1.Get)("preferences"),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AlertController.prototype, "getAlertPreferences", null);
__decorate([
    (0, tsoa_1.Security)("jwt"),
    (0, tsoa_1.Put)("preferences"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AlertController.prototype, "updateAlertPreferences", null);
exports.AlertController = AlertController = __decorate([
    (0, tsoa_1.Route)("alerts"),
    __metadata("design:paramtypes", [])
], AlertController);
