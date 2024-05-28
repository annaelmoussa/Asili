import express from "express";
import yaml from "js-yaml";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { authRoutes } from "./routes/authRoutes";
import { orderRoutes } from "./routes/orderRoutes";
import { productRoutes } from "./routes/productRoutes";
import { stockRoutes } from "./routes/stockRoutes";
import { userRoutes } from "./routes/userRoutes";

export const setupRoutes = (app: express.Application): void => {
  const options = {
    definition: {
      openapi: "3.1.0",
      info: {
        title: "API with Swagger",
        version: "0.1.0",
        description: "This is a simple CRUD API",
        licence: {
          name: "MIT",
          url: "https://opensource.org/licenses/MIT",
        },
        contact: {
          name: "Swagger",
          url: "https://swagger.io",
          email: "info@email.com",
        },
      },
      servers: [
        {
          url: "http://localhost:3000",
        },
      ],
    },
    apis: ["src/routes/*.ts"],
  };

  const swaggerSpec = swaggerJsdoc(options);

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, { explorer: true })
  );

  app.get("/swagger.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  app.get("/swagger.yaml", (req, res) => {
    res.setHeader("Content-Type", "text/yaml");
    const yamlSpec = yaml.dump(swaggerSpec);
    res.send(yamlSpec);
  });

  authRoutes(app);
  productRoutes(app);
  orderRoutes(app);
  stockRoutes(app);
  userRoutes(app);
};
