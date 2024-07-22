"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAssociations = void 0;
const Order_1 = __importStar(require("./Order"));
const OrderItem_1 = __importStar(require("./OrderItem"));
const User_1 = __importDefault(require("./User"));
const Shipping_1 = __importStar(require("./Shipping"));
const Payment_1 = __importStar(require("./Payment"));
const Product_1 = __importDefault(require("./Product"));
/**
 * TODO Lotfi : faire une méthode générique associate
 */
const setupAssociations = () => {
    const models = {
        Order: Order_1.default,
        OrderItem: OrderItem_1.default,
        User: User_1.default,
        Product: Product_1.default,
        Shipping: Shipping_1.default,
        Payment: Payment_1.default
    };
    (0, Order_1.associateOrder)(models);
    (0, OrderItem_1.associateOrderItem)(models);
    (0, Shipping_1.associateShipping)(models);
    (0, Payment_1.associatePayment)(models);
};
exports.setupAssociations = setupAssociations;
