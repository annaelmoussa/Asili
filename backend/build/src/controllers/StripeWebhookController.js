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
exports.StripeWebhookController = void 0;
const tsoa_1 = require("tsoa");
const StripeWebhookService_1 = require("../services/StripeWebhookService");
let StripeWebhookController = class StripeWebhookController extends tsoa_1.Controller {
    constructor() {
        super(...arguments);
        this.stripeWebhookService = new StripeWebhookService_1.StripeWebhookService();
    }
    async handleWebhook(rawBody, signature) {
        try {
            await this.stripeWebhookService.handleWebhook(rawBody, signature);
        }
        catch (error) {
            console.error('Error processing webhook:', error);
            this.setStatus(400);
        }
    }
};
exports.StripeWebhookController = StripeWebhookController;
__decorate([
    (0, tsoa_1.SuccessResponse)("200", "OK"),
    (0, tsoa_1.Post)("/"),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Header)("stripe-signature")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Buffer, String]),
    __metadata("design:returntype", Promise)
], StripeWebhookController.prototype, "handleWebhook", null);
exports.StripeWebhookController = StripeWebhookController = __decorate([
    (0, tsoa_1.Route)("stripe-webhook")
], StripeWebhookController);
