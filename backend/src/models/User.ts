import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/dbConfigPostgres";
import { IUser } from "../interfaces/IUser";
import EmailNotification from "./EmailNotification";
import UserPreferences from "./UserPreferences";

type UserCreationAttributes = Optional<IUser, "id" | "isConfirmed" | "confirmationToken">;

class User extends Model<IUser, UserCreationAttributes> implements IUser {
  public id!: string;
  public email!: string;
  public password!: string;
  public role!: string;
  public isConfirmed!: boolean;
  public confirmationToken?: string;
  public stripeCustomerId?: string;

  static associate() {
    User.hasMany(EmailNotification, {
      foreignKey: "userId",
      as: "notifications",
    });
    User.hasOne(UserPreferences, { foreignKey: "userId", as: "preferences" });
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "ROLE_USER",
    },
    isConfirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    confirmationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stripeCustomerId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'User',
    timestamps: true,
  }
);

export default User;
