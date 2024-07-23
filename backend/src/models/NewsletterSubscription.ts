import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
  tableName: "NewsletterSubscription",
  timestamps: true,
})
export default class NewsletterSubscription extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  userId?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isSubscribed!: boolean;
}