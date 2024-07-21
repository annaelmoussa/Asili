import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  CreatedAt,
} from "sequelize-typescript";
import { IPayment } from "../interfaces/IPayment";
import User from "./User";

@Table({
  tableName: "Payment",
  timestamps: true,
})
export default class Payment extends Model<IPayment> implements IPayment {
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
  stripePaymentId!: string;

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

  @CreatedAt
  createdAt!: Date;
}
