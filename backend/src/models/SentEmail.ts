import { Table, Column, Model, DataType } from "sequelize-typescript";
import { ISentEmail } from "../interfaces/ISentEmail";

@Table({
  tableName: "SentEmail",
  timestamps: false,
})
export default class SentEmail extends Model<ISentEmail> implements ISentEmail {
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
  to!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  subject!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  text?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  html?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  sentAt!: Date;
}
