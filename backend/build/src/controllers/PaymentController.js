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
exports.PaymentController = void 0;
const tsoa_1 = require("tsoa");
const paymentService_1 = require("../services/paymentService");
let PaymentController = class PaymentController extends tsoa_1.Controller {
    constructor() {
        super(...arguments);
        this.paymentService = new paymentService_1.PaymentService();
    }
    async createPaymentSession(userId, items) {
        console.log(items, userId);
        try {
            if (!items || !userId) {
                this.setStatus(400);
                return { sessionId: "Missing required fields" };
            }
            console.log("Received items:", items);
            console.log("Received userId:", userId);
            const sessionId = await this.paymentService.createPaymentSession(items, userId);
            return { sessionId };
        }
        catch (error) {
            console.error("Error in createPaymentSession:", error);
            this.setStatus(500);
            return { sessionId: "Internal server error" };
        }
    }
    async getPayments() {
        try {
            const payments = await this.paymentService.getAllPayments();
            return payments;
        }
        catch (error) {
            console.error("Error in getPayments:", error);
            this.setStatus(500);
            throw new Error("Internal server error");
        }
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, tsoa_1.Post)("create-session/{userId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "createPaymentSession", null);
__decorate([
    (0, tsoa_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getPayments", null);
exports.PaymentController = PaymentController = __decorate([
    (0, tsoa_1.Route)("payments")
], PaymentController);
