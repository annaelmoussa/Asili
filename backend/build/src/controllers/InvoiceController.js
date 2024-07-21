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
exports.InvoiceController = void 0;
const tsoa_1 = require("tsoa");
const invoiceService_1 = require("../services/invoiceService");
let InvoiceController = class InvoiceController extends tsoa_1.Controller {
    constructor() {
        super(...arguments);
        this.invoiceService = new invoiceService_1.InvoiceService();
    }
    async getUserInvoices(userId) {
        return this.invoiceService.getInvoicesByUserId(userId);
    }
    async createInvoice(requestBody) {
        this.setStatus(201);
        return this.invoiceService.createInvoice(requestBody);
    }
};
exports.InvoiceController = InvoiceController;
__decorate([
    (0, tsoa_1.Get)("{userId}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "getUserInvoices", null);
__decorate([
    (0, tsoa_1.SuccessResponse)("201", "Invoice Created"),
    (0, tsoa_1.Post)("create"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "createInvoice", null);
exports.InvoiceController = InvoiceController = __decorate([
    (0, tsoa_1.Route)("invoices")
], InvoiceController);
