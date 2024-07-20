import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/dbConfigPostgres";
import User from "./User";
import { IAlertPreference } from "../interfaces/IAlertPreference";

type AlertPreferenceCreationAttributes = Optional<IAlertPreference, "id" | "newProductInCategory" | "productRestock" | "priceChange" | "newsletter">;

class AlertPreference extends Model<IAlertPreference, AlertPreferenceCreationAttributes> implements IAlertPreference {
  public id!: string;
  public userId!: string;
  public newProductInCategory!: boolean;
  public productRestock!: boolean;
  public priceChange!: boolean;
  public newsletter!: boolean;
}

AlertPreference.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    newProductInCategory: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    productRestock: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    priceChange: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    newsletter: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "AlertPreference",
    tableName: "AlertPreference",
    timestamps: true,
  }
);

export default AlertPreference;