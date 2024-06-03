import cors from "cors";
import express from "express";
import helmet from "helmet";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "../build/routes";

require("dotenv").config();

export const app = express();
app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Asili API",
      version: "1.0.0",
    },
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerDocs);
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

RegisterRoutes(app);

app.use((err: any, req: any, res: any, next: any) => {
  res.status(err.status || 500).json({
    message: err.message,
  });
});
