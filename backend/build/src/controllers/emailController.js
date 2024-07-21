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
exports.EmailController = void 0;
const tsoa_1 = require("tsoa");
const emailService_1 = __importDefault(require("../services/emailService"));
let EmailController = class EmailController extends tsoa_1.Controller {
    async sendEmail(requestBody) {
        const { to, subject, text, html } = requestBody;
        try {
            await (0, emailService_1.default)(to, subject, text, html);
            return { message: "Email sent successfully" };
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            else {
                throw new Error("Unknown error");
            }
        }
    }
};
exports.EmailController = EmailController;
__decorate([
    (0, tsoa_1.Post)("send"),
    (0, tsoa_1.SuccessResponse)("200", "Email sent successfully"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "sendEmail", null);
exports.EmailController = EmailController = __decorate([
    (0, tsoa_1.Route)("email")
], EmailController);
