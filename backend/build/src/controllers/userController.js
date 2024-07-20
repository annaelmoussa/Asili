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
exports.UserController = void 0;
const tsoa_1 = require("tsoa");
const userService_1 = require("../services/userService");
const bcrypt_1 = __importDefault(require("bcrypt"));
const UnauthorizedError_1 = require("../errors/UnauthorizedError");
let UserController = class UserController extends tsoa_1.Controller {
    constructor() {
        super(...arguments);
        this.userService = new userService_1.UserService();
    }
    async getUser(userId, request) {
        await this.checkAuthorization(request, userId);
        return this.userService.get(userId);
    }
    async getUsers(request) {
        return this.userService.getAll();
    }
    async createUser(requestBody) {
        if (requestBody.password) {
            requestBody.password = await bcrypt_1.default.hash(requestBody.password, 10);
        }
        this.setStatus(201);
        return this.userService.create(requestBody);
    }
    async updateUser(userId, requestBody, request) {
        await this.checkAuthorization(request, userId);
        if (requestBody.password) {
            requestBody.password = await bcrypt_1.default.hash(requestBody.password, 10);
        }
        return this.userService.update(userId, requestBody);
    }
    async deleteUser(userId, request) {
        await this.checkAuthorization(request, userId);
        return this.userService.softDelete(userId);
    }
    async checkAuthorization(request, userId) {
        const requestingUserId = request.user.id;
        const userRole = request.user.role;
        if (userRole === "ROLE_ADMIN") {
            return; // Admins are always authorized
        }
        if (requestingUserId !== userId) {
            throw new UnauthorizedError_1.UnauthorizedError("You are not authorized to perform this action on another user's account");
        }
    }
};
exports.UserController = UserController;
__decorate([
    (0, tsoa_1.Security)("jwt"),
    (0, tsoa_1.Get)("{userId}"),
    (0, tsoa_1.OperationId)("getUserById"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUser", null);
__decorate([
    (0, tsoa_1.Security)("jwt", ["ROLE_ADMIN"]),
    (0, tsoa_1.Get)(),
    (0, tsoa_1.OperationId)("getAllUsers"),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUsers", null);
__decorate([
    (0, tsoa_1.SuccessResponse)("201", "Created"),
    (0, tsoa_1.Post)(),
    (0, tsoa_1.OperationId)("createUser"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
__decorate([
    (0, tsoa_1.Security)("jwt"),
    (0, tsoa_1.Put)("{userId}"),
    (0, tsoa_1.OperationId)("updateUser"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __param(2, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, tsoa_1.Security)("jwt"),
    (0, tsoa_1.Delete)("{userId}"),
    (0, tsoa_1.OperationId)("deleteUser"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
exports.UserController = UserController = __decorate([
    (0, tsoa_1.Security)("jwt"),
    (0, tsoa_1.Route)("users"),
    (0, tsoa_1.Tags)("User")
], UserController);
