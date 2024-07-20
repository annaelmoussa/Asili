require("dotenv").config();

module.exports = {
  development: {
    username: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "password",
    database: process.env.POSTGRES_DB || "postgres",
    host: "postgres",
    dialect: "postgres",
    uri:
      process.env.POSTGRES_URI ||
      "postgres://postgres:password@postgres:5432/postgres",
  },
  test: {
    username: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "password",
    database: process.env.POSTGRES_DB || "postgres",
    host: "postgres",
    dialect: "postgres",
    uri:
      process.env.POSTGRES_URI ||
      "postgres://postgres:password@postgres:5432/postgres",
  },
  production: {
    username: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "password",
    database: process.env.POSTGRES_DB || "postgres",
    host: "postgres",
    dialect: "postgres",
    uri:
      process.env.POSTGRES_URI ||
      "postgres://postgres:password@postgres:5432/postgres",
  },
};
