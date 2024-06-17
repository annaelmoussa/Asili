import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/dbConfigPostgres";
import { IUserPreferences } from "../interfaces/IUserPreferences";
import User from "./User";

type UserPreferencesCreationAttributes = Optional<IUserPreferences, "id">;

class UserPreferences
  extends Model<IUserPreferences, UserPreferencesCreationAttributes>
  implements IUserPreferences
{
  public id!: string;
  public userId!: string;
  public alertNewProduct!: boolean;
  public alertRestock!: boolean;
  public alertPriceChange!: boolean;
  public newsletterSubscription!: boolean;

  static associate() {
    UserPreferences.belongsTo(User, { foreignKey: "userId", as: "user" });
  }
}

UserPreferences.init(
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
    alertNewProduct: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    alertRestock: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    alertPriceChange: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    newsletterSubscription: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "UserPreferences",
    timestamps: true,
  }
);

export default UserPreferences;
