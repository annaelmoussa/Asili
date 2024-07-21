import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { IInvoice } from "@/interfaces/IInvoice";
import User from "./User";

@Table({
  tableName: "Invoice",
  timestamps: true,
})
export default class Invoice extends Model<IInvoice> implements IInvoice {
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

  @BelongsTo(() => User)
  user!: User;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  stripeInvoiceId!: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  amount!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  status!: string;
}
