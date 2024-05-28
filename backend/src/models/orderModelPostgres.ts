import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/dbConfigPostgres';
import { IOrder } from '../interfaces/IOrder';

class OrderPostgres extends Model<IOrder> implements IOrder {
    public id!: string;
    public userId!: string;
    public productId!: string;
    public quantity!: number;
    public status!: string;
}

OrderPostgres.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    productId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Order',
    timestamps: true,
});

export default OrderPostgres;
