import {DataTypes, Model, Optional} from "sequelize";
import { sequelize } from "../config/dbConfigPostgres";
import { IInvoice } from "@/interfaces/IInvoice";

type ProductCreationAttributes = Optional<IInvoice, "id">;

class Invoice
  extends Model<IInvoice, ProductCreationAttributes>
  implements IInvoice {
  public id!: string;
  public userId!: string;
  public stripeInvoiceId!: string;
  public amount!: number;
  public status!: string;

  static associate(models: any) {
    Invoice.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  }
}

Invoice.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  stripeInvoiceId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  }
},
  {
  sequelize,
  modelName: 'Invoice',
  tableName: 'Invoice',
  timestamps: true
});

export default Invoice;
