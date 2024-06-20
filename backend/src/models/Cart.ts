import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/dbConfigPostgres";
import { ICart } from "../interfaces/ICart";

type ProductCreationAttributes = Optional<ICart, "id">;

class Cart
    extends Model<ICart, ProductCreationAttributes>
    implements ICart
{
    public id!: string;
    public userId!: string;

    static associate(models: any) {
        Cart.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        Cart.hasMany(models.CartItem, { foreignKey: 'cartItemId', as: 'items' });
    }
}

Cart.init({
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
    }
}, {
    sequelize,
    modelName: 'Cart',
    tableName: 'Cart',
    timestamps: true
});

export default Cart;
