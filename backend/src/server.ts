import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { setupRoutes } from "./app";
import connectMongoDB from "./config/dbConfig";
import { connectPostgresDB } from "./config/dbConfigPostgres";
import { errorHandler } from "./middlewares/errorMiddleware";

dotenv.config();

const app = express();
const port = process.env.PORT ?? 3000;

connectMongoDB();
connectPostgresDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setupRoutes(app);


app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
