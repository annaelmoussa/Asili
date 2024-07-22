import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  AfterCreate,
} from "sequelize-typescript";
import { IPayment } from "../interfaces/IPayment";
import User from "./User";
import Order from "./Order";
import { MongoOrder } from "./MongoOrder";

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

  @ForeignKey(() => Order)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  orderId!: string;

  @BelongsTo(() => Order)
  order!: Order;

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

  @AfterCreate
  static async updateMongoOrder(payment: Payment): Promise<void> {
    try {
      await MongoOrder.findOneAndUpdate(
        { id: payment.orderId },
        {
          $set: {
            payment: {
              id: payment.id,
              stripePaymentId: payment.stripePaymentId,
              amount: payment.amount,
              status: payment.status
            }
          }
        },
        { new: true }
      );
    } catch (error) {
      console.error('Error updating MongoOrder with payment info:', error);
    }
  }
}

export const associatePayment = (models: any) => {
  Payment.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  Payment.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order' });
};