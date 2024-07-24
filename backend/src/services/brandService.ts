import Brand from "../models/Brand";
import { IBrand, BrandCreationParams } from "../interfaces/IBrand";
import { Sequelize, Transaction } from "sequelize";
import { sequelize as defaultSequelize } from "../config/dbConfigPostgres";
import Product from "../models/Product";
import { BrandMongoService } from "./brandMongoService";
import { HttpError } from "../types/HttpError";

export class BrandService {
  private sequelize: Sequelize;

  constructor(sequelize?: Sequelize) {
    this.sequelize = sequelize || defaultSequelize;
  }

  public async get(
    brandId: string,
    options?: { transaction?: Transaction }
  ): Promise<IBrand | null> {
    const brand = await Brand.findByPk(brandId, options);
    return brand ? brand.toJSON() : null;
  }

  public async getAll(options?: {
    transaction?: Transaction;
  }): Promise<IBrand[]> {
    const brands = await Brand.findAll(options);
    return brands.map((brand) => brand.toJSON());
  }

  public async create(
    brandCreationParams: BrandCreationParams,
    options?: { transaction?: Transaction }
  ): Promise<IBrand> {
    const brand = await Brand.create(brandCreationParams, options);
    return brand.toJSON();
  }

  public async update(
    id: string,
    updates: Partial<IBrand>,
    options?: { transaction?: Transaction }
  ): Promise<IBrand> {
    console.log(
      "Updating brand:",
      id,
      "with updates:",
      JSON.stringify(updates)
    );
    const transaction =
      options?.transaction || (await this.sequelize.transaction());

    try {
      const validUpdates = this.filterValidUpdates(updates);
      console.log("Valid updates:", JSON.stringify(validUpdates));

      const [updatedRowsCount, [updatedBrand]] = await Brand.update(
        validUpdates,
        {
          where: { id },
          returning: true,
          transaction,
        }
      );

      console.log("Updated rows count:", updatedRowsCount);

      if (updatedRowsCount === 0) {
        throw new HttpError(404, "Brand not found");
      }

      console.log("Updated brand:", JSON.stringify(updatedBrand));

      if (!options?.transaction) await transaction.commit();

      const brandMongoService = new BrandMongoService();
      await brandMongoService.syncWithPostgres(updatedBrand.toJSON());
      console.log("Brand synced with MongoDB");

      return updatedBrand.toJSON();
    } catch (error) {
      console.error("Error updating brand:", error);
      if (!options?.transaction) await transaction.rollback();
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError(500, "Error updating brand");
    }
  }

  private filterValidUpdates(updates: Partial<IBrand>): Partial<IBrand> {
    const allowedFields: (keyof IBrand)[] = ["name"];

    return Object.entries(updates)
      .filter(([key]) => allowedFields.includes(key as keyof IBrand))
      .reduce((obj, [key, value]) => {
        obj[key as keyof IBrand] = value;
        return obj;
      }, {} as Partial<IBrand>);
  }

  public async delete(
    id: string,
    options?: { transaction?: Transaction }
  ): Promise<{ success: boolean; message?: string }> {
    const transaction =
      options?.transaction || (await this.sequelize.transaction());

    try {
      const productsCount = await Product.count({
        where: { brandId: id },
        transaction,
      });

      if (productsCount > 0) {
        if (!options?.transaction) await transaction.rollback();
        return {
          success: false,
          message: `Impossible de supprimer la marque. ${productsCount} produit(s) y sont associés.`,
        };
      }

      const deletedRowsCount = await Brand.destroy({
        where: { id },
        transaction,
      });

      if (!options?.transaction) await transaction.commit();
      return {
        success: deletedRowsCount > 0,
        message:
          deletedRowsCount > 0
            ? "Marque supprimée avec succès."
            : "Marque non trouvée.",
      };
    } catch (error) {
      if (!options?.transaction) await transaction.rollback();
      throw error;
    }
  }

  public async getByName(name: string): Promise<IBrand | null> {
    return Brand.findOne({ where: { name } });
  }
}

export default BrandService;
