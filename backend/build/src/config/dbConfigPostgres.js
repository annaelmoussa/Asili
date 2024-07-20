"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = exports.connectPostgresDB = void 0;
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize(process.env.POSTGRES_URI, {
    dialect: "postgres",
    logging: false,
});
exports.sequelize = sequelize;
const connectPostgresDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("PostgreSQL connected successfully");
    }
    catch (error) {
        console.error("PostgreSQL connection error:", error);
        process.exit(1);
    }
};
exports.connectPostgresDB = connectPostgresDB;
