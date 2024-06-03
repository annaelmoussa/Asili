import { app } from "./app";
import connectMongoDB from "./config/dbConfig";
import { connectPostgresDB } from "./config/dbConfigPostgres";

require("dotenv").config();

const port = process.env.PORT ?? 3000;

connectMongoDB();
connectPostgresDB();

app.listen(port, () =>
  console.log(`Server is running at http://localhost:${port}`)
);
