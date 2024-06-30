import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { sequelize } from "../config/dbConfigPostgres";
import Widget from "./Widget";
import { IUser } from "@/interfaces/IUser";
import { ALL_SCOPES } from "../config/scopes";

type UserCreationAttributes = Optional<IUser, "id" | "isConfirmed">;

class User extends Model<IUser, UserCreationAttributes> implements IUser {
  public id!: string;
  public email!: string;
  public password!: string;
  public role!: string;
  public isConfirmed!: boolean;
  public token?: string;
  public scopes?: string[];

  static associate() {
    User.hasMany(Widget, { foreignKey: "userId" });
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
    scopes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'User',
    timestamps: true,
    hooks: {
      beforeCreate: (user: User) => {
        if (user.role === "ROLE_ADMIN") {
          user.scopes = ALL_SCOPES;
        }
      },
    },
  }
);

export default User;
