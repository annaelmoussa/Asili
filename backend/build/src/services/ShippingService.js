"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingService = void 0;
const Shipping_1 = __importDefault(require("../models/Shipping"));
class ShippingService {
    async createShipping(shippingInfo) {
        return Shipping_1.default.create(shippingInfo);
    }
    async updateTrackingNumber(shippingId, trackingNumber) {
        const shipping = await Shipping_1.default.findByPk(shippingId);
        if (shipping) {
            shipping.trackingNumber = trackingNumber;
            shipping.status = 'Shipped';
            await shipping.save();
            return shipping;
        }
        return null;
    }
}
exports.ShippingService = ShippingService;
