import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/dbConfigPostgres";
import { IOrderItem } from "../interfaces/IOrderItem";

type OrderItemCreationAttributes = Optional<IOrderItem, "id">;

class OrderItem extends Model<IOrderItem, OrderItemCreationAttributes> implements IOrderItem {
  public id!: string;
  public orderId!: string;
  public productId!: string;
  public quantity!: number;
  public priceAtPurchase!: number;
}

OrderItem.init({
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
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Product',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  priceAtPurchase: {
    type: DataTypes.DOUBLE,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'OrderItem',
  tableName: 'OrderItem',
  timestamps: true
});

export const associateOrderItem = (models: any) => {
  OrderItem.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order' });
  OrderItem.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
};

export default OrderItem;