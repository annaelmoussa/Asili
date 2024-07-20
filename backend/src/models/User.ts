import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  HasOne,
  BeforeCreate,
  BeforeUpdate,
} from "sequelize-typescript";
import { Optional } from "sequelize";
import { IUser } from "../interfaces/IUser";
import { ALL_SCOPES } from "../config/scopes";
import EmailNotification from "./EmailNotification";
import UserPreferences from "./UserPreferences";
import Widget from "./Widget";
import AlertPreference from "./AlertPreference";

type UserCreationAttributes = Optional<IUser, "id" | "isConfirmed" | "confirmationToken" | "lastPasswordChange">;

@Table({
  tableName: "User",
  timestamps: true,
  paranoid: true,
})
export default class User extends Model<IUser, UserCreationAttributes> implements IUser {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "ROLE_USER",
  })
  role!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isConfirmed!: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  confirmationToken?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  stripeCustomerId?: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    defaultValue: [],
  })
  scopes!: string[];

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  lastPasswordChange!: Date;

  @HasMany(() => EmailNotification)
  notifications!: EmailNotification[];

  @HasOne(() => UserPreferences)
  preferences!: UserPreferences;

  @HasMany(() => Widget)
  widgets!: Widget[];

  @BeforeCreate
  @BeforeUpdate
  static handleUserChanges(instance: User) {
    if (instance.role === "ROLE_ADMIN") {
      instance.scopes = ALL_SCOPES;
    }
    if (instance.changed('password')) {
      instance.lastPasswordChange = new Date();
    }
  }

  static associate() {
    User.hasMany(Widget, { foreignKey: "userId" });
    User.hasOne(AlertPreference, { foreignKey: "userId", as: "alertPreferences" });
  }
}