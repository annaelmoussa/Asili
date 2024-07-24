import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  AfterCreate,
} from "sequelize-typescript";
import { IShipping } from "../interfaces/IShipping";
import { MongoOrder } from "./MongoOrder";
import Order from "./Order";

@Table({
  tableName: "Shipping",
  timestamps: true,
})
export default class Shipping extends Model<IShipping> implements IShipping {
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

  @BelongsTo(() => Order)
  order!: Order;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  trackingNumber!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  status!: string;

  @AfterCreate
  static async updateMongoOrder(shippingData: Shipping): Promise<void> {
    console.log('Shipping @AfterCreate triggered');
    console.log('Shipping data:', JSON.stringify(shippingData, null, 2));
    try {
      const result = await MongoOrder.findOneAndUpdate(
        { id: shippingData.orderId },
        {
          $set: {
            shipping: {
              id: shippingData.id,
              address: shippingData.address,
              status: shippingData.status,
              trackingNumber: shippingData.trackingNumber
            },
          }
        },
        { new: true }
      );
      console.log('MongoDB update result:', JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('Error updating MongoOrder with shipping info:', error);
    }
  }
}

export const associateShipping = (models: any) => {
  Shipping.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order' });
};