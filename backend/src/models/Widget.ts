import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { IWidget } from "../interfaces/IWidget";
import User from "./User";

@Table({
  tableName: "Widget",
  timestamps: true,
})
export default class Widget extends Model<IWidget> implements IWidget {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type!: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  settings!: any;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  x!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  y!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  w!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  h!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId!: string;

  @BelongsTo(() => User)
  user!: User;
}
