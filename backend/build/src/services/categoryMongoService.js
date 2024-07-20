"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryMongoService = void 0;
const CategoryMongo_1 = __importDefault(require("../models/CategoryMongo"));
class CategoryMongoService {
    async syncWithPostgres(category) {
        await CategoryMongo_1.default.findOneAndUpdate({ id: category.id }, category, {
            upsert: true,
            new: true,
        });
    }
}
exports.CategoryMongoService = CategoryMongoService;
