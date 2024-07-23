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
exports.NewsletterController = void 0;
const tsoa_1 = require("tsoa");
const NewsletterService_1 = require("../services/NewsletterService");
const User_1 = __importDefault(require("../models/User"));
let NewsletterController = class NewsletterController extends tsoa_1.Controller {
    constructor() {
        super();
        this.newsletterService = new NewsletterService_1.NewsletterService();
    }
    async sendNewsletter(newsletterData) {
        await this.newsletterService.sendNewsletter(newsletterData.subject, newsletterData.content);
    }
    async subscribeToNewsletter(request) {
        const userId = request.user.id;
        const user = await User_1.default.findByPk(userId);
        if (!user)
            throw new Error("User not found");
        await this.newsletterService.subscribeToNewsletter(user.email, userId);
    }
    async subscribeGuestToNewsletter(body) {
        await this.newsletterService.subscribeToNewsletter(body.email);
    }
    async unsubscribeFromNewsletter(request) {
        const userId = request.user.id;
        const user = await User_1.default.findByPk(userId);
        if (!user)
            throw new Error("User not found");
        await this.newsletterService.unsubscribeFromNewsletter(user.email);
    }
    async getNewsletterSubscriptionStatus(request) {
        const userId = request.user.id;
        return await this.newsletterService.getSubscriptionStatus(userId);
    }
};
exports.NewsletterController = NewsletterController;
__decorate([
    (0, tsoa_1.Security)("jwt", ["ROLE_ADMIN"]),
    (0, tsoa_1.Post)("send"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NewsletterController.prototype, "sendNewsletter", null);
__decorate([
    (0, tsoa_1.Security)("jwt"),
    (0, tsoa_1.Post)("subscribe"),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NewsletterController.prototype, "subscribeToNewsletter", null);
__decorate([
    (0, tsoa_1.Post)("subscribe-guest"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NewsletterController.prototype, "subscribeGuestToNewsletter", null);
__decorate([
    (0, tsoa_1.Security)("jwt"),
    (0, tsoa_1.Post)("unsubscribe"),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NewsletterController.prototype, "unsubscribeFromNewsletter", null);
__decorate([
    (0, tsoa_1.Security)("jwt"),
    (0, tsoa_1.Get)("subscription-status"),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NewsletterController.prototype, "getNewsletterSubscriptionStatus", null);
exports.NewsletterController = NewsletterController = __decorate([
    (0, tsoa_1.Route)("newsletter"),
    __metadata("design:paramtypes", [])
], NewsletterController);
