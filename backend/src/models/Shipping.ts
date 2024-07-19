import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/dbConfigPostgres";
import { IShipping } from "../interfaces/IShipping";

type ShippingCreationAttributes = Optional<IShipping, "id">;

class Shipping extends Model<IShipping, ShippingCreationAttributes> implements IShipping {
  public id!: string;
  public orderId!: string;
  public address!: string;
  public trackingNumber?: string;
  public status!: string;

  static associate(models: any) {
    Shipping.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order' });
  }
}

Shipping.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Order',
      key: 'id'
    }
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  trackingNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Shipping',
  tableName: 'Shipping',
  timestamps: true
});

export default Shipping;