import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
  } from "sequelize-typescript";
  import User from "./User";
  import Product from "./Product";
  import Category from "./Category";
  
  @Table({
    tableName: "ProductSubscription",
    timestamps: true,
  })
  export default class ProductSubscription extends Model {
    @Column({
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
      primaryKey: true,
    })
    id!: string;
  
    @ForeignKey(() => User)
    @Column({
      type: DataType.UUID,
      allowNull: false,
    })
    userId!: string;
  
    @BelongsTo(() => User)
    user!: User;
  
    @ForeignKey(() => Product)
    @Column({
      type: DataType.UUID,
      allowNull: true,
    })
    productId?: string;
  
    @BelongsTo(() => Product)
    product?: Product;
  
    @ForeignKey(() => Category)
    @Column({
      type: DataType.UUID,
      allowNull: true,
    })
    categoryId?: string;
  
    @BelongsTo(() => Category)
    category?: Category;
  
    @Column({
      type: DataType.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    })
    notifyRestock!: boolean;
  
    @Column({
      type: DataType.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    })
    notifyPriceChange!: boolean;
  
    @Column({
      type: DataType.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    })
    notifyNewProductInCategory!: boolean;
  }