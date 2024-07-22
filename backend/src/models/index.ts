import { Sequelize } from "sequelize-typescript";
import User from "./User";
import Cart from "./Cart";
import Product from "./Product";
import CartItem from "./CartItem";
import TokenBlacklist from "./TokenBlacklist";
import Widget from "./Widget";
import Brand from "./Brand";
import Category from "./Category";
import Payment from "./Payment";
import SentEmail from "./SentEmail";
import AlertPreference from "./AlertPreference";
import Shipping from "./Shipping";
import Order from "./Order";
import OrderItem from "./OrderItem";
import RGPDModule from "./RGPDModule";

const env = process.env.NODE_ENV || "development";
const config = require("../config/config.js")[env];

const sequelize = new Sequelize({
  ...config,
  models: [
    User,
    Cart,
    Product,
    CartItem,
    TokenBlacklist,
    Widget,
    Brand,
    Category,
    Payment,
    SentEmail,
    AlertPreference,
    Shipping,
    Order,
    OrderItem,
    RGPDModule,
  ],
});

const db = {
  sequelize,
  Sequelize,
  User,
  Cart,
  Product,
  CartItem,
  TokenBlacklist,
  Widget,
  Brand,
  Category,
  Payment,
  SentEmail,
  AlertPreference,
  Shipping,
  Order,
  OrderItem,
  RGPDModule,
};

export = db;
