import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import { IBrand } from "../interfaces/IBrand";
import Product from "./Product";

@Table({
  tableName: "Brand",
  timestamps: true,
})
export default class Brand extends Model<IBrand> implements IBrand {
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
