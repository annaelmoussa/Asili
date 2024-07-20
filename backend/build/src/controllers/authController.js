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
exports.AuthController = void 0;
const tsoa_1 = require("tsoa");
const authService_1 = require("../services/authService");
let AuthController = class AuthController extends tsoa_1.Controller {
    async login(body) {
        const authService = new authService_1.AuthService();
        try {
            return await authService.login(body.email, body.password);
        }
        catch (error) {
            this.setStatus(401);
            throw new Error("Invalid email or password");
        }
    }
    async signup(body) {
        const authService = new authService_1.AuthService();
        return authService.signup(body.email, body.password);
    }
    async logout(body) {
        const authService = new authService_1.AuthService();
        await authService.logout(body.token);
    }
    async getUser(request) {
        const token = request.headers.authorization?.split(" ")[1];
        if (!token) {
            throw new Error("Token is missing");
        }
        const authService = new authService_1.AuthService();
        return authService.getUser(token);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, tsoa_1.Post)("login"),
    (0, tsoa_1.OperationId)("loginUser"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, tsoa_1.Post)("signup"),
    (0, tsoa_1.OperationId)("signupUser"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    (0, tsoa_1.Post)("logout"),
    (0, tsoa_1.OperationId)("logoutUser"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, tsoa_1.Get)("user"),
    (0, tsoa_1.OperationId)("getAuthenticatedUser"),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getUser", null);
exports.AuthController = AuthController = __decorate([
    (0, tsoa_1.Route)("auth"),
    (0, tsoa_1.Tags)("Auth")
], AuthController);
