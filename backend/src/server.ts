import { app } from "./app"; // Import the Express application
import db from "./models";
import { runSeeders } from "./seeders";
import { Umzug, SequelizeStorage } from "umzug";
import { Sequelize } from "sequelize";
import connectMongoDB from "./config/dbConfig";
import { connectPostgresDB } from "./config/dbConfigPostgres";
import { syncPostgresToMongo } from "./utils/syncPostgresToMongo";

const port = process.env.PORT || 3000;

async function initializeDatabase() {
  try {
    await db.sequelize.sync({ alter: true });
    console.log("Database synchronized");

    const umzug = new Umzug({
      migrations: {
        glob: "src/migrations/*.js",
        resolve: ({ name, path, context }) => {
          const migration = require(path ?? "");
          return {
            name,
            up: async () => migration.up(context, Sequelize),
            down: async () => migration.down(context, Sequelize),
          };
        },
      },
      context: db.sequelize.getQueryInterface(),
      storage: new SequelizeStorage({ sequelize: db.sequelize }),
      logger: console,
    });

    await umzug.up();
    console.log("Migrations executed");

    await runSeeders(db.sequelize);
    console.log("Seeders executed");
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
}

async function startServer() {
  try {
    await initializeDatabase();
    await connectMongoDB();
    await connectPostgresDB();
    await syncPostgresToMongo();

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
}

startServer();
