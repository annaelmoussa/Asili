import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/dbConfigPostgres";
import { IWidget } from "../interfaces/IWidget";

type WidgetCreationAttributes = Optional<IWidget, "id">;

class Widget
  extends Model<IWidget, WidgetCreationAttributes>
  implements IWidget
{
  public id!: string;
  public name!: string;
  public type!: string;
  public settings!: any;
  public x!: number;
  public y!: number;
  public w!: number;
  public h!: number;
}

Widget.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    settings: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    x: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    y: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    w: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    h: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Widget",
    timestamps: true,
  }
);

export default Widget;
