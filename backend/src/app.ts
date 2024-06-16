import express from "express";
import helmet from "helmet";
import cors from "cors";
import { RegisterRoutes } from "../build/routes";
import { errorHandler } from "./middlewares/errorHandler";
import * as swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "../build/swagger.json";

export const app = express();
const corsOptions = {
  origin: "http://localhost:8080",
  credentials: true,
};
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

RegisterRoutes(app);

app.use(errorHandler);
