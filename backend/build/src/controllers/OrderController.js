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
exports.OrderController = void 0;
const tsoa_1 = require("tsoa");
const orderService_1 = require("../services/orderService");
const mongoOrderService_1 = require("../services/mongoOrderService");
const ShippingService_1 = require("../services/ShippingService");
let OrderController = class OrderController extends tsoa_1.Controller {
    constructor() {
        super(...arguments);
        this.orderService = new orderService_1.OrderService();
        this.mongoOrderService = new mongoOrderService_1.MongoOrderService();
        this.shippingService = new ShippingService_1.ShippingService();
    }
    async getOrders(userId) {
        return this.orderService.getOrdersByUserId(userId);
    }
    async getTrackingInfo(trackingNumber) {
        return this.shippingService.getTrackingInfo(trackingNumber);
    }
    async createOrder(requestBody) {
        this.setStatus(201);
        const { items, ...orderInfo } = requestBody;
        return this.orderService.createOrder(orderInfo, items);
    }
    async getOrder(orderId) {
        return this.orderService.getOrderById(orderId);
    }
    async updateOrderStatus(orderId, status) {
        return this.orderService.updateOrderStatus(orderId, status);
    }
    async getMongoOrders(userId) {
        return this.mongoOrderService.getOrdersByUserId(userId);
    }
    async getMongoOrder(orderId) {
        return this.mongoOrderService.getOrderById(orderId);
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, tsoa_1.Get)("get-orders/{userId}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getOrders", null);
__decorate([
    (0, tsoa_1.Get)("tracking/{trackingNumber}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getTrackingInfo", null);
__decorate([
    (0, tsoa_1.SuccessResponse)("201", "Order Created"),
    (0, tsoa_1.Post)("create"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "createOrder", null);
__decorate([
    (0, tsoa_1.Get)("order/{orderId}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getOrder", null);
__decorate([
    (0, tsoa_1.Post)("update-status/{orderId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "updateOrderStatus", null);
__decorate([
    (0, tsoa_1.Get)("get-mongo-orders/{userId}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getMongoOrders", null);
__decorate([
    (0, tsoa_1.Get)("get-mongo-order/{orderId}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getMongoOrder", null);
exports.OrderController = OrderController = __decorate([
    (0, tsoa_1.Route)("orders")
], OrderController);
