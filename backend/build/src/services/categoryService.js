"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const Category_1 = __importDefault(require("../models/Category"));
const dbConfigPostgres_1 = require("../config/dbConfigPostgres");
const Product_1 = __importDefault(require("../models/Product"));
class CategoryService {
    constructor(sequelize) {
        this.sequelize = sequelize || dbConfigPostgres_1.sequelize;
    }
    async get(categoryId, options) {
        const category = await Category_1.default.findByPk(categoryId, options);
        return category ? category.toJSON() : null;
    }
    async getAll(options) {
        const categories = await Category_1.default.findAll(options);
        return categories.map((category) => category.toJSON());
    }
    async create(categoryCreationParams, options) {
        const category = await Category_1.default.create(categoryCreationParams, options);
        return category.toJSON();
    }
    async update(id, updates, options) {
        const [updatedRowsCount, [updatedCategory]] = await Category_1.default.update(updates, {
            where: { id },
            returning: true,
            ...options,
        });
        return updatedRowsCount > 0 ? updatedCategory.toJSON() : null;
    }
    async delete(id, options) {
        const transaction = options?.transaction || (await this.sequelize.transaction());
        try {
            const productsCount = await Product_1.default.count({
                where: { categoryId: id },
                transaction,
            });
            if (productsCount > 0) {
                if (!options?.transaction)
                    await transaction.rollback();
                return {
                    success: false,
                    message: `Impossible de supprimer la catégorie. ${productsCount} produit(s) y sont associés.`,
                };
            }
            const deletedRowsCount = await Category_1.default.destroy({
                where: { id },
                transaction,
            });
            if (!options?.transaction)
                await transaction.commit();
            return {
                success: deletedRowsCount > 0,
                message: deletedRowsCount > 0
                    ? "Catégorie supprimée avec succès."
                    : "Catégorie non trouvée.",
            };
        }
        catch (error) {
            if (!options?.transaction)
                await transaction.rollback();
            throw error;
        }
    }
    async getByName(name) {
        return Category_1.default.findOne({ where: { name } });
    }
}
exports.CategoryService = CategoryService;
exports.default = CategoryService;
