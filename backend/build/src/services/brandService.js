"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandService = void 0;
// services/brandService.ts
const Brand_1 = __importDefault(require("../models/Brand"));
const dbConfigPostgres_1 = require("../config/dbConfigPostgres");
const Product_1 = __importDefault(require("../models/Product"));
const brandMongoService_1 = require("./brandMongoService");
const HttpError_1 = require("../types/HttpError");
class BrandService {
    constructor(sequelize) {
        this.sequelize = sequelize || dbConfigPostgres_1.sequelize;
    }
    async get(brandId, options) {
        const brand = await Brand_1.default.findByPk(brandId, options);
        return brand ? brand.toJSON() : null;
    }
    async getAll(options) {
        const brands = await Brand_1.default.findAll(options);
        return brands.map((brand) => brand.toJSON());
    }
    async create(brandCreationParams, options) {
        const brand = await Brand_1.default.create(brandCreationParams, options);
        return brand.toJSON();
    }
    async update(id, updates, options) {
        console.log("Updating brand:", id, "with updates:", JSON.stringify(updates));
        const transaction = options?.transaction || (await this.sequelize.transaction());
        try {
            const validUpdates = this.filterValidUpdates(updates);
            console.log("Valid updates:", JSON.stringify(validUpdates));
            const [updatedRowsCount, [updatedBrand]] = await Brand_1.default.update(validUpdates, {
                where: { id },
                returning: true,
                transaction,
            });
            console.log("Updated rows count:", updatedRowsCount);
            if (updatedRowsCount === 0) {
                throw new HttpError_1.HttpError(404, "Brand not found");
            }
            console.log("Updated brand:", JSON.stringify(updatedBrand));
            if (!options?.transaction)
                await transaction.commit();
            // Synchroniser avec MongoDB
            const brandMongoService = new brandMongoService_1.BrandMongoService();
            await brandMongoService.syncWithPostgres(updatedBrand.toJSON());
            console.log("Brand synced with MongoDB");
            return updatedBrand.toJSON();
        }
        catch (error) {
            console.error("Error updating brand:", error);
            if (!options?.transaction)
                await transaction.rollback();
            if (error instanceof HttpError_1.HttpError) {
                throw error;
            }
            throw new HttpError_1.HttpError(500, "Error updating brand");
        }
    }
    filterValidUpdates(updates) {
        // Liste des champs autorisés pour la mise à jour
        const allowedFields = ["name"]; // Ajoutez d'autres champs si nécessaire
        return Object.entries(updates)
            .filter(([key]) => allowedFields.includes(key))
            .reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
        }, {});
    }
    async delete(id, options) {
        const transaction = options?.transaction || (await this.sequelize.transaction());
        try {
            // Vérifier si des produits sont associés à cette marque
            const productsCount = await Product_1.default.count({
                where: { brandId: id },
                transaction,
            });
            if (productsCount > 0) {
                if (!options?.transaction)
                    await transaction.rollback();
                return {
                    success: false,
                    message: `Impossible de supprimer la marque. ${productsCount} produit(s) y sont associés.`,
                };
            }
            const deletedRowsCount = await Brand_1.default.destroy({
                where: { id },
                transaction,
            });
            if (!options?.transaction)
                await transaction.commit();
            return {
                success: deletedRowsCount > 0,
                message: deletedRowsCount > 0
                    ? "Marque supprimée avec succès."
                    : "Marque non trouvée.",
            };
        }
        catch (error) {
            if (!options?.transaction)
                await transaction.rollback();
            throw error;
        }
    }
    async getByName(name) {
        return Brand_1.default.findOne({ where: { name } });
    }
}
exports.BrandService = BrandService;
exports.default = BrandService;
