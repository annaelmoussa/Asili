import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/dbConfigPostgres';
import User from './User';
import { IPayment } from "../interfaces/IPayment";

type PaymentCreationAttributes = Optional<IPayment, 'id'>;

class Payment extends Model<IPayment, PaymentCreationAttributes> implements IPayment {
  public id!: string;
  public userId!: string;
  public stripePaymentId!: string;
  public amount!: number;
  public status!: string;

  static associate(models: any) {
    Payment.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  }
}

Payment.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  stripePaymentId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Payment',
  tableName: 'Payment',
  timestamps: true
});

export default Payment;
