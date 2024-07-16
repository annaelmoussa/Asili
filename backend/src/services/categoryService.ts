// services/categoryService.ts
import Category from "../models/Category";
import { ICategory, CategoryCreationParams } from "../interfaces/ICategory";
import { Sequelize, Transaction } from "sequelize";
import { sequelize as defaultSequelize } from "../config/dbConfigPostgres";

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
    options?: { Transaction?: Transaction }
  ): Promise<boolean> {
    const deletedRowsCount = await Category.destroy({
      where: { id },
      ...options,
    });
    return deletedRowsCount > 0;
  }

  public async getByName(name: string): Promise<ICategory | null> {
    return Category.findOne({ where: { name } });
  }
}

export default CategoryService;
