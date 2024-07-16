import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { ICartItem } from "../interfaces/ICartItem";
import Cart from "./Cart";
import Product from "./Product";

@Table({
  tableName: "CartItem",
  modelName: "CartItem",
})
export default class CartItem extends Model<ICartItem> implements ICartItem {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ForeignKey(() => Cart)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  cartId!: string;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  productId!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  quantity!: number;

  @BelongsTo(() => Product)
  product!: Product;

  @BelongsTo(() => Cart)
  cart!: Cart;
}
