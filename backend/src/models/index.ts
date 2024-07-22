import { Sequelize } from "sequelize-typescript";
import User from "./User";
import Cart from "./Cart";
import Product from "./Product";
import CartItem from "./CartItem";
import TokenBlacklist from "./TokenBlacklist";
import Widget from "./Widget";
import Brand from "./Brand";
import Category from "./Category";
import Invoice from "./Invoice";
import Payment from "./Payment";
import SentEmail from "./SentEmail";
import AlertPreference from "./AlertPreference";

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
    Invoice,
    Payment,
    SentEmail,
    AlertPreference,
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
  Invoice,
  Payment,
  SentEmail,
  AlertPreference,
};

export = db;
