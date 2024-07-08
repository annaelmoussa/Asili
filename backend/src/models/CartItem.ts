import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/dbConfigPostgres";
import { ICartItem } from "../interfaces/ICartItem";
import Product from "./Product";
import Cart from "./Cart";

type ProductCreationAttributes = Optional<ICartItem, "id">;

class CartItem
  extends Model<ICartItem, ProductCreationAttributes>
  implements ICartItem
{
  public id!: string;
  public cartId!: string;
  public productId!: string;
  public quantity!: number;

  static associate(models: any) {
    CartItem.belongsTo(models.Cart, { foreignKey: "cartId", as: "cart" });
    CartItem.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "product",
    });
  }
}

CartItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    cartId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Cart",
        key: "id",
      },
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Product",
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    modelName: "CartItem",
    tableName: "CartItem",
  }
);

CartItem.associate({ Cart, Product });

export default CartItem;
