import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { IEmailNotification } from "../interfaces/IEmailNotification";
import User from "./User";

@Table({
  tableName: "EmailNotifications",
  timestamps: true,
})
export default class EmailNotification
  extends Model<IEmailNotification>
  implements IEmailNotification
{
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

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type!: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  productId?: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  categoryId?: string;

  @BelongsTo(() => User)
  user!: User;
}
