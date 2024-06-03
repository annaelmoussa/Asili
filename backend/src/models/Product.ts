import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/dbConfigPostgres";
import { IProduct } from "../interfaces/IProduct";

type ProductCreationAttributes = Optional<IProduct, "id">;

class Product
  extends Model<IProduct, ProductCreationAttributes>
  implements IProduct
{
  public id!: string;
  public name!: string;
  public description!: string;
  public price!: number;
  public category!: string;
  public stock!: number;
}

Product.init(
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
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Product",
    timestamps: true,
  }
);

export default Product;
