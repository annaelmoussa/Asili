"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stockReleaseQueue = exports.reservationExpirationQueue = void 0;
const bull_1 = __importDefault(require("bull"));
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
exports.reservationExpirationQueue = new bull_1.default("reservation-expiration", redisUrl);
exports.stockReleaseQueue = new bull_1.default("stock-release", redisUrl);
