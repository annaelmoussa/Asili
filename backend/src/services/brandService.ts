// services/brandService.ts
import Brand from "../models/Brand";
import { IBrand, BrandCreationParams } from "../interfaces/IBrand";
import { Sequelize, Transaction } from "sequelize";
import { sequelize as defaultSequelize } from "../config/dbConfigPostgres";

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
  ): Promise<IBrand | null> {
    const [updatedRowsCount, [updatedBrand]] = await Brand.update(updates, {
      where: { id },
      returning: true,
      ...options,
    });
    return updatedRowsCount > 0 ? updatedBrand.toJSON() : null;
  }

  public async delete(
    id: string,
    options?: { Transaction?: Transaction }
  ): Promise<boolean> {
    const deletedRowsCount = await Brand.destroy({
      where: { id },
      ...options,
    });
    return deletedRowsCount > 0;
  }

  public async getByName(name: string): Promise<IBrand | null> {
    return Brand.findOne({ where: { name } });
  }
}

export default BrandService;
