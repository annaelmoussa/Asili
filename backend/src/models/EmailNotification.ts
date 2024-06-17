import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/dbConfigPostgres";
import { IEmailNotification } from "../interfaces/IEmailNotification";
import User from "./User";

type EmailNotificationCreationAttributes = Optional<IEmailNotification, "id">;

class EmailNotification
  extends Model<IEmailNotification, EmailNotificationCreationAttributes>
  implements IEmailNotification
{
  public id!: string;
  public userId!: string;
  public type!: string;
  public productId?: string;
  public categoryId?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    EmailNotification.belongsTo(models.User, { as: "user" });
  }
}

EmailNotification.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "EmailNotification",
    timestamps: true,
  }
);

export default EmailNotification;
