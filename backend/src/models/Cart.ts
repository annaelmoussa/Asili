import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import { ICart } from "../interfaces/ICart";
import User from "./User";
import CartItem from "./CartItem";

@Table({
  tableName: "Cart",
  timestamps: true,
})
export default class Cart extends Model<ICart> implements ICart {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId!: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  reservationExpires!: Date | null;

  @BelongsTo(() => User)
  user!: User;

  @HasMany(() => CartItem)
  items!: CartItem[];
}
