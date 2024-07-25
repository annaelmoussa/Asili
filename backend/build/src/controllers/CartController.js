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
exports.CartController = void 0;
const tsoa_1 = require("tsoa");
const cartService_1 = require("../services/cartService");
const UnauthorizedError_1 = require("../errors/UnauthorizedError");
let CartController = class CartController extends tsoa_1.Controller {
    constructor() {
        super(...arguments);
        this.cartService = new cartService_1.CartService();
    }
    async getCartItems(request) {
        const userId = request.user.id;
        const cartId = await this.cartService.getCartIdByUserId(userId);
        if (!cartId) {
            return [];
        }
        return await this.cartService.getCartItems(cartId);
    }
    async addItem(requestBody, request) {
        const userId = request.user.id;
        this.setStatus(201);
        return this.cartService.addItem(userId, requestBody.productId, requestBody.quantity);
    }
    async removeItem(itemId, request) {
        await this.checkAuthorization(request, itemId);
        await this.cartService.removeItem(itemId);
        this.setStatus(200);
    }
    async updateItemQuantity(itemId, quantity, request) {
        await this.checkAuthorization(request, itemId);
        console.log("Updating item quantity:", itemId, quantity);
        return this.cartService.updateItemQuantity(itemId, quantity);
    }
    async clearExpiredReservations(request) {
        this.checkAdminAuthorization(request);
        await this.cartService.clearExpiredReservations();
        this.setStatus(200);
    }
    async checkAuthorization(request, itemId) {
        const userId = request.user.id;
        const userRole = request.user.role;
        if (userRole === "ROLE_ADMIN") {
            return;
        }
        const cartItem = await this.cartService.getCartItemById(itemId);
        if (!cartItem || cartItem.cart.userId !== userId) {
            throw new UnauthorizedError_1.UnauthorizedError("You are not authorized to perform this action");
        }
    }
    checkAdminAuthorization(request) {
        if (request.user.role !== "ROLE_ADMIN") {
            throw new UnauthorizedError_1.UnauthorizedError("Only admins can perform this action");
        }
    }
};
exports.CartController = CartController;
__decorate([
    (0, tsoa_1.Get)("get-cart-items"),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "getCartItems", null);
__decorate([
    (0, tsoa_1.SuccessResponse)("201", "Created"),
    (0, tsoa_1.Post)("add-item"),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "addItem", null);
__decorate([
    (0, tsoa_1.Delete)("remove-item/{itemId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "removeItem", null);
__decorate([
    (0, tsoa_1.Post)("update-item-quantity/{itemId}/{quantity}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "updateItemQuantity", null);
__decorate([
    (0, tsoa_1.Post)("clear-expired-reservations"),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "clearExpiredReservations", null);
exports.CartController = CartController = __decorate([
    (0, tsoa_1.Route)("carts"),
    (0, tsoa_1.Security)("jwt")
], CartController);
