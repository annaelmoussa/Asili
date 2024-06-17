import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/dbConfigPostgres";
import { ISentEmail } from "../interfaces/ISentEmail";


type SentEmailCreationAttributes = Optional<ISentEmail, "id" | "sentAt">;

class SentEmail extends Model<ISentEmail, SentEmailCreationAttributes> implements ISentEmail {
  public id!: string;
  public to!: string;
  public subject!: string;
  public text?: string;
  public html?: string;
  public sentAt!: Date;
}

SentEmail.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    to: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    html: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "SentEmail",
    timestamps: false,
  }
);

export default SentEmail;