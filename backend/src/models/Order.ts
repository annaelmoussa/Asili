import {DataTypes, Model, Optional} from "sequelize";
import { sequelize } from "../config/dbConfigPostgres";
import { IOrder } from "@/interfaces/IOrder";

type ProductCreationAttributes = Optional<IOrder, "id">;

class Order
  extends Model<IOrder, ProductCreationAttributes>
  implements IOrder {
  public id!: string;
  public userId!: string;
  public stripeInvoiceId!: string;
  public amount!: number;
  public status!: string;

  static associate(models: any) {
    Order.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  }
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
  }
},
  {
  sequelize,
  modelName: 'Order',
  tableName: 'Order',
  timestamps: true
});

export default Order;