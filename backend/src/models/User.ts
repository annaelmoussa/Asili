import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  HasOne,
  BeforeCreate,
} from "sequelize-typescript";
import { IUser } from "../interfaces/IUser";
import { ALL_SCOPES } from "../config/scopes";
import EmailNotification from "./EmailNotification";
import UserPreferences from "./UserPreferences";
import Widget from "./Widget";

@Table({
  tableName: "User",
  timestamps: true,
})
export default class User extends Model<IUser> implements IUser {
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

  @HasMany(() => EmailNotification)
  notifications!: EmailNotification[];

  @HasOne(() => UserPreferences)
  preferences!: UserPreferences;

  @HasMany(() => Widget)
  widgets!: Widget[];

  @BeforeCreate
  static setAdminScopes(instance: User) {
    if (instance.role === "ROLE_ADMIN") {
      instance.scopes = ALL_SCOPES;
    }
  }
}
