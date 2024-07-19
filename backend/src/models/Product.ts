import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { IProduct, ProductAttributes } from "../interfaces/IProduct";
import Category from "./Category";
import Brand from "./Brand";

@Table({
  tableName: "Product",
  timestamps: true,
})
export default class Product
  extends Model<ProductAttributes>
  implements IProduct
{
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description!: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  price!: number;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  categoryId!: string;

  @BelongsTo(() => Category)
  category!: Category;

  @ForeignKey(() => Brand)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  brandId!: string;

  @BelongsTo(() => Brand)
  brand!: Brand;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  stock!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 10,
  })
  lowStockThreshold!: number;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: [],
  })
  stockHistory!: { date: Date; quantity: number }[];

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  image?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isPromotion!: boolean;
}
