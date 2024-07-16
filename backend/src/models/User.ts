import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BeforeCreate,
} from "sequelize-typescript";
import { IUser } from "../interfaces/IUser";
import { ALL_SCOPES } from "../config/scopes";
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
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    defaultValue: [],
  })
  scopes!: string[];

  @HasMany(() => Widget)
  widgets!: Widget[];

  @BeforeCreate
  static setAdminScopes(instance: User) {
    if (instance.role === "ROLE_ADMIN") {
      instance.scopes = ALL_SCOPES;
    }
  }
}
