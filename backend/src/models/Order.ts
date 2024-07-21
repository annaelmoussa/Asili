import { DataTypes, Model, Optional } from "sequelize";
import { IOrder } from "../interfaces/IOrder";
import { sequelize } from "../config/dbConfigPostgres";

type OrderCreationAttributes = Optional<IOrder, "id">;

class Order extends Model<IOrder, OrderCreationAttributes> implements IOrder {
  public id!: string;
  public userId!: string;
  public stripeInvoiceId!: string;
  public amount!: number;
  public status!: string;
  public shippingAddress!: string;
  public trackingNumber?: string;
}

Order.init({
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
  stripeInvoiceId: {
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
  },
  shippingAddress: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  sequelize,
  modelName: 'Order',
  tableName: 'Order',
  timestamps: true
});

export const associateOrder = (models: any) => {
  Order.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  Order.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'items' });
};

export default Order;