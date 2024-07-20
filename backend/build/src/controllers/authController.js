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
            throw new Error(error.message);
        }
    }
    async signup(body) {
        const authService = new authService_1.AuthService();
        await authService.signup(body.email, body.password);
        this.setStatus(201);
        return { message: "User registered. Please check your email to confirm your account." };
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
    async confirmEmail(token) {
        const authService = new authService_1.AuthService();
        const user = await authService.confirmEmail(token);
        if (user) {
            return { message: "Email confirmed successfully" };
        }
        else {
            this.setStatus(400);
            return { message: "Invalid or expired token" };
        }
    }
    async resendConfirmationEmail(body) {
        const authService = new authService_1.AuthService();
        await authService.resendConfirmationEmail(body.email);
        return { message: "A new confirmation email has been sent. Please check your email." };
    }
    async resetPasswordRequest(body) {
        const authService = new authService_1.AuthService();
        await authService.sendPasswordResetEmail(body.email);
        return { message: "If an account with that email exists, a password reset link has been sent." };
    }
    async resetPassword(body) {
        const authService = new authService_1.AuthService();
        await authService.resetPassword(body.token, body.password, body.confirm_password);
        return { message: "Password has been reset successfully." };
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
    (0, tsoa_1.SuccessResponse)("201", "Created"),
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
__decorate([
    (0, tsoa_1.Get)("confirm"),
    (0, tsoa_1.SuccessResponse)("200", "Email confirmed successfully"),
    __param(0, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "confirmEmail", null);
__decorate([
    (0, tsoa_1.Post)("resend-confirmation-email"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendConfirmationEmail", null);
__decorate([
    (0, tsoa_1.Post)("reset-password-request"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPasswordRequest", null);
__decorate([
    (0, tsoa_1.Post)("reset-password"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, tsoa_1.Route)("auth"),
    (0, tsoa_1.Tags)("Auth")
], AuthController);
