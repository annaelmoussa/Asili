import Category from "../models/Category";
import { ICategory, CategoryCreationParams } from "../interfaces/ICategory";
import { Sequelize, Transaction } from "sequelize";
import { sequelize as defaultSequelize } from "../config/dbConfigPostgres";
import Product from "../models/Product";

export class CategoryService {
  private sequelize: Sequelize;

  constructor(sequelize?: Sequelize) {
    this.sequelize = sequelize || defaultSequelize;
  }

  public async get(
    categoryId: string,
    options?: { transaction?: Transaction }
  ): Promise<ICategory | null> {
    const category = await Category.findByPk(categoryId, options);
    return category ? category.toJSON() : null;
  }

  public async getAll(options?: {
    transaction?: Transaction;
  }): Promise<ICategory[]> {
    const categories = await Category.findAll(options);
    return categories.map((category) => category.toJSON());
  }

  public async create(
    categoryCreationParams: CategoryCreationParams,
    options?: { transaction?: Transaction }
  ): Promise<ICategory> {
    const category = await Category.create(categoryCreationParams, options);
    return category.toJSON();
  }

  public async update(
    id: string,
    updates: Partial<ICategory>,
    options?: { transaction?: Transaction }
  ): Promise<ICategory | null> {
    const [updatedRowsCount, [updatedCategory]] = await Category.update(
      updates,
      {
        where: { id },
        returning: true,
        ...options,
      }
    );
    return updatedRowsCount > 0 ? updatedCategory.toJSON() : null;
  }

  public async delete(
    id: string,
    options?: { transaction?: Transaction }
  ): Promise<{ success: boolean; message?: string }> {
    const transaction =
      options?.transaction || (await this.sequelize.transaction());

    try {
      const productsCount = await Product.count({
        where: { categoryId: id },
        transaction,
      });

      if (productsCount > 0) {
        if (!options?.transaction) await transaction.rollback();
        return {
          success: false,
          message: `Impossible de supprimer la catégorie. ${productsCount} produit(s) y sont associés.`,
        };
      }

      const deletedRowsCount = await Category.destroy({
        where: { id },
        transaction,
      });

      if (!options?.transaction) await transaction.commit();
      return {
        success: deletedRowsCount > 0,
        message:
          deletedRowsCount > 0
            ? "Catégorie supprimée avec succès."
            : "Catégorie non trouvée.",
      };
    } catch (error) {
      if (!options?.transaction) await transaction.rollback();
      throw error;
    }
  }

  public async getByName(name: string): Promise<ICategory | null> {
    return Category.findOne({ where: { name } });
  }
}

export default CategoryService;
