import { app } from "./app";
import connectMongoDB from "./config/dbConfig";
import { connectPostgresDB } from "./config/dbConfigPostgres";
import { syncPostgresToMongo } from "./utils/syncPostgresToMongo";

require("dotenv").config();

const port = process.env.PORT ?? 3000;

async function startServer() {
  try {
    await connectMongoDB();
    console.log("MongoDB connected successfully");

    await connectPostgresDB();
    console.log("PostgreSQL connected successfully");

    await syncPostgresToMongo();
    console.log("Initial synchronization complete");

    app.listen(port, () =>
      console.log(`Server is running at http://localhost:${port}`)
    );
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
}

startServer();
