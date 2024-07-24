import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  AfterCreate,
} from "sequelize-typescript";
import { IOrderItem } from "../interfaces/IOrder";
import { MongoOrder } from "./MongoOrder";
import Order from "./Order";
import Product from "./Product";

@Table({
  tableName: "OrderItem",
  timestamps: true,
})
export default class OrderItem extends Model<IOrderItem> implements IOrderItem {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ForeignKey(() => Order)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  orderId!: string;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  productId!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity!: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  priceAtPurchase!: number;

  @BelongsTo(() => Order)
  order!: Order;

  @BelongsTo(() => Product)
  product!: Product;

  @AfterCreate
  static async updateMongoOrder(orderItem: OrderItem): Promise<void> {
    console.log('orderItem @AfterCreate');
    try {
      const itemWithProduct = await OrderItem.findByPk(orderItem.id, {
        include: [{ model: Product, as: 'product' }]
      });

      if (itemWithProduct && itemWithProduct.product) {
        await MongoOrder.findOneAndUpdate(
          { id: orderItem.orderId },
          {
            $push: {
              items: {
                id: itemWithProduct.id,
                productId: itemWithProduct.productId,
                productName: itemWithProduct.product.name,
                productDescription: itemWithProduct.product.description,
                priceAtPurchase: itemWithProduct.priceAtPurchase,
                productImage: itemWithProduct.product.image,
                quantity: itemWithProduct.quantity,
              }
            }
          },
          { new: true }
        );
      }
    } catch (error) {
      console.error('Error updating MongoOrder with new order item:', error);
    }
  }
}

export const associateOrderItem = (models: any) => {
  OrderItem.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order' });
  OrderItem.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
};