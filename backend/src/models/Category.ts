import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import { ICategory } from "../interfaces/ICategory";
import Product from "./Product";

@Table({
  tableName: "Category",
  timestamps: true,
})
export default class Category extends Model<ICategory> implements ICategory {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name!: string;

  @HasMany(() => Product)
  products!: Product[];
}
