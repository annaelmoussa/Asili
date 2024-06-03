import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  (process.env.POSTGRES_URI as string) ||
    "postgres://postgres:password@localhost:5432/postgres",
  {
    dialect: "postgres",
  }
);

const connectPostgresDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected successfully");
  } catch (error) {
    console.error("PostgreSQL connection error:", error);
    process.exit(1);
  }
};

export { connectPostgresDB, sequelize };
