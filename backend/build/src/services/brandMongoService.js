"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandMongoService = void 0;
const BrandMongo_1 = __importDefault(require("../models/BrandMongo"));
class BrandMongoService {
    async syncWithPostgres(brand) {
        try {
            await BrandMongo_1.default.findOneAndUpdate({ id: brand.id }, brand, {
                upsert: true,
                new: true,
            });
            console.log("Brand synced with MongoDB:", brand.id);
        }
        catch (error) {
            console.error("Error syncing brand with MongoDB:", error);
            throw error;
        }
    }
}
exports.BrandMongoService = BrandMongoService;
