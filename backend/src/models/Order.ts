import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  HasOne,
  AfterCreate,
} from "sequelize-typescript";
import { IOrder, IOrderItem } from "../interfaces/IOrder";
import { MongoOrder } from "./MongoOrder";
import User from "./User";
import Product from "./Product";
import OrderItem from "./OrderItem";
import Shipping from "./Shipping";
import Payment from "./Payment";

@Table({
  tableName: "Order",
  timestamps: true,
})
export default class Order extends Model<IOrder> implements IOrder {
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

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  shippingAddress!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  trackingNumber?: string;

  @HasMany(() => OrderItem)
  items?: IOrderItem[];

  @HasOne(() => Shipping)
  shipping?: Shipping;

  @HasOne(() => Payment)
  payment?: Payment;

  @AfterCreate
  static async createMongoOrder(order: Order, options: any): Promise<void> {
    try {
      console.log('Order created:', order.toJSON());
      const orderWithDetails = await Order.findByPk(order.id, {
        include: [
          {
            model: OrderItem,
            as: 'items',
            include: [{ model: Product, as: 'product' }]
          },
          {
            model: Shipping,
            as: 'shipping'
          },
          {
            model: Payment,
            as: 'payment'
          }
        ],
        transaction: options.transaction
      });

      console.log('Order with details:', orderWithDetails?.toJSON());

      if (orderWithDetails) {
        await MongoOrder.create({
          id: orderWithDetails.id,
          userId: orderWithDetails.userId,
          stripeInvoiceId: orderWithDetails.stripeInvoiceId,
          amount: orderWithDetails.amount,
          status: orderWithDetails.status,
          items: orderWithDetails.items?.map((item: any) => ({
            id: item.id,
            productId: item.product?.id,
            productName: item.product?.name,
            productDescription: item.product?.description,
            priceAtPurchase: item.priceAtPurchase,
            productImage: item.product?.image,
            quantity: item.quantity,
          })),
          shipping: orderWithDetails.shipping ? {
            id: orderWithDetails.shipping.id,
            address: orderWithDetails.shipping.address,
            status: orderWithDetails.shipping.status,
            trackingNumber: orderWithDetails.shipping.trackingNumber
          } : undefined,
          payment: orderWithDetails.payment ? {
            id: orderWithDetails.payment.id,
            stripePaymentId: orderWithDetails.payment.stripePaymentId,
            amount: orderWithDetails.payment.amount,
            status: orderWithDetails.payment.status
          } : undefined
        });
      }
    } catch (error) {
      console.error('Error creating MongoOrder:', error);
    }
  }
}

export const associateOrder = (models: any) => {
  Order.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  Order.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'items' });
};