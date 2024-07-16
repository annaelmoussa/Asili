import { Table, Column, Model, DataType } from "sequelize-typescript";
import { ITokenBlacklist } from "../interfaces/ITokenBlacklist";
import { Optional } from "sequelize";

interface TokenBlacklistCreationAttributes
  extends Optional<ITokenBlacklist, "id"> {}

@Table({
  tableName: "TokenBlacklist",
  timestamps: true,
})
export default class TokenBlacklist
  extends Model<ITokenBlacklist, TokenBlacklistCreationAttributes>
  implements ITokenBlacklist
{
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  token!: string;
}
