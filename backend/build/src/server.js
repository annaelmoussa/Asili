"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app"); // Import the Express application
const models_1 = __importDefault(require("./models"));
const seeders_1 = require("./seeders");
const umzug_1 = require("umzug");
const sequelize_1 = require("sequelize");
const dbConfig_1 = __importDefault(require("./config/dbConfig"));
const dbConfigPostgres_1 = require("./config/dbConfigPostgres");
const syncPostgresToMongo_1 = require("./utils/syncPostgresToMongo");
const queues_1 = require("./queues");
require("./queues/processors");
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8000;
async function initializeDatabase() {
    try {
        await models_1.default.sequelize.sync({ alter: true });
        console.log("Database synchronized");
        const umzug = new umzug_1.Umzug({
            migrations: {
                glob: "src/migrations/*.js",
                resolve: ({ name, path, context }) => {
                    const migration = require(path ?? "");
                    return {
                        name,
                        up: async () => migration.up(context, sequelize_1.Sequelize),
                        down: async () => migration.down(context, sequelize_1.Sequelize),
                    };
                },
            },
            context: models_1.default.sequelize.getQueryInterface(),
            storage: new umzug_1.SequelizeStorage({ sequelize: models_1.default.sequelize }),
            logger: console,
        });
        await umzug.up();
        console.log("Migrations executed");
        await (0, seeders_1.runSeeders)(models_1.default.sequelize);
        console.log("Seeders executed");
    }
    catch (error) {
        console.error("Error initializing database:", error);
        throw error;
    }
}
async function startServer() {
    try {
        await initializeDatabase();
        await (0, dbConfig_1.default)();
        await (0, dbConfigPostgres_1.connectPostgresDB)();
        await (0, syncPostgresToMongo_1.syncPostgresToMongo)();
        queues_1.reservationExpirationQueue.on("error", (error) => {
            console.error("Reservation expiration queue error:", error);
        });
        queues_1.stockReleaseQueue.on("error", (error) => {
            console.error("Stock release queue error:", error);
        });
        return new Promise((resolve) => {
            const server = app_1.app.listen(port, "0.0.0.0", () => {
                console.log(`Server is running on port ${port}`);
                resolve(server);
            });
            server.on("error", (error) => {
                console.error("Server error:", error);
                process.exit(1);
            });
        });
    }
    catch (error) {
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
