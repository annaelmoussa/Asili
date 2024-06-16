import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/dbConfigPostgres";
import { ITokenBlacklist } from "../interfaces/ITokenBlacklist";

type TokenBlacklistCreationAttributes = Optional<ITokenBlacklist, "id">;

class TokenBlacklist
  extends Model<ITokenBlacklist, TokenBlacklistCreationAttributes>
  implements ITokenBlacklist
{
  public id!: string;
  public token!: string;
}

TokenBlacklist.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "TokenBlacklist",
    timestamps: true,
  }
);

export { TokenBlacklist };
