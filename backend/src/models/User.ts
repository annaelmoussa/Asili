import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/dbConfigPostgres";
import { IUser } from "../interfaces/IUser";

type UserCreationAttributes = Optional<IUser, "id" | "isConfirmed">;

class User extends Model<IUser, UserCreationAttributes> implements IUser {
  public id!: string;
  public email!: string;
  public password!: string;
  public role!: string;
  public isConfirmed!: boolean;
  public token?: string;
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
  },
  {
    sequelize,
    modelName: "User",
    timestamps: true,
  }
);

export default User;
