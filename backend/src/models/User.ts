import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { sequelize } from "../config/dbConfigPostgres";
import { IUser } from "../interfaces/IUser";
import Widget from "./Widget";
import { ALL_SCOPES } from "../config/scopes";
import AlertPreference from "./AlertPreference";

type UserCreationAttributes = Optional<IUser, "id" | "isConfirmed" | "confirmationToken">;

class User extends Model<IUser, UserCreationAttributes> implements IUser {
  public id!: string;
  public email!: string;
  public password!: string;
  public role!: string;
  public isConfirmed!: boolean;
  public confirmationToken?: string;
  public stripeCustomerId?: string;
  public token?: string;
  public scopes?: string[];
  public lastPasswordChange!: Date;

  static associate() {
    User.hasMany(Widget, { foreignKey: "userId" });
    User.hasOne(AlertPreference, { foreignKey: "userId", as: "alertPreferences" });
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
    scopes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    lastPasswordChange: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
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
        if (user.changed('password')) {
          user.lastPasswordChange = new Date();
        }
      },
      beforeUpdate: (user: User) => {
        if (user.changed('password')) {
          user.lastPasswordChange = new Date();
        }
      },
    },
  }
);

export default User;
