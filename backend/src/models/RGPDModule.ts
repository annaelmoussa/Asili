import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

export interface IRGPDModule {
  id: string;
  name: string;
  content: string;
  type: "popup" | "text_block";
  requiresAcceptance: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Table({
  tableName: "rgpd_modules",
  timestamps: true,
})
export default class RGPDModule
  extends Model<IRGPDModule>
  implements IRGPDModule
{
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  content!: string;

  @Column({
    type: DataType.ENUM("popup", "text_block"),
    allowNull: false,
  })
  type!: "popup" | "text_block";

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  requiresAcceptance!: boolean;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}
