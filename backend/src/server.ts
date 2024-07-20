import { app } from "./app"; // Import the Express application
import db from "./models";
import { runSeeders } from "./seeders";
import { Umzug, SequelizeStorage } from "umzug";
import { Sequelize } from "sequelize";
import connectMongoDB from "./config/dbConfig";
import { connectPostgresDB } from "./config/dbConfigPostgres";
import { syncPostgresToMongo } from "./utils/syncPostgresToMongo";
import { reservationExpirationQueue, stockReleaseQueue } from "./queues";
import "./queues/processors";

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8000;

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
    throw error;
  }
}

async function startServer() {
  try {
    await initializeDatabase();
    await connectMongoDB();
    await connectPostgresDB();
    await syncPostgresToMongo();

    reservationExpirationQueue.on("error", (error) => {
      console.error("Reservation expiration queue error:", error);
    });

    stockReleaseQueue.on("error", (error) => {
      console.error("Stock release queue error:", error);
    });

    return new Promise((resolve) => {
      const server = app.listen(port, "0.0.0.0", () => {
        console.log(`Server is running on port ${port}`);
        resolve(server);
      });

      server.on("error", (error) => {
        console.error("Server error:", error);
        process.exit(1);
      });
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    throw error;
  }
}

startServer().catch((error) => {
  console.error("Unhandled error during server startup:", error);
  process.exit(1);
});

// Gestion des erreurs non capturées
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Application specific logging, throwing an error, or other logic here
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception thrown:", error);
  // Application specific logging, throwing an error, or other logic here
  process.exit(1);
});
