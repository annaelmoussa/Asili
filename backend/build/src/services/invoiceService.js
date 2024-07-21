"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceService = void 0;
const Invoice_1 = __importDefault(require("../models/Invoice"));
class InvoiceService {
    async getInvoicesByUserId(userId) {
        return Invoice_1.default.findAll({
            where: { userId }
        });
    }
    async createInvoice(invoiceInfo) {
        return Invoice_1.default.create(invoiceInfo);
    }
}
exports.InvoiceService = InvoiceService;
