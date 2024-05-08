// import express from "express";
// import swaggerJsdoc from "swagger-jsdoc";
// import swaggerUi from "swagger-ui-express";
// import { itemRoutes } from "./routes/itemRoutes";
//
// export const setupRoutes = (app: express.Application): void => {
//   const options = {
//     definition: {
//       openapi: "3.1.0",
//       info: {
//         title: "API with Swagger",
//         version: "0.1.0",
//         description: "This is a simple CRUD API",
//         licence: {
//           name: "MIT",
//           url: "https://opensource.org/licenses/MIT",
//         },
//         contact: {
//           name: "Swagger",
//           url: "https://swagger.io",
//           email: "info@email.com",
//         },
//       },
//       servers: [
//         {
//           url: "http://localhost:3000",
//         },
//       ],
//     },
//     apis: ["src/routes/*.ts"],
//   };
//
//   const swaggerSpec = swaggerJsdoc(options);
//
//
//
//   app.use(
//     "/api-docs",
//     swaggerUi.serve,
//     swaggerUi.setup(swaggerSpec, { explorer: true })
//   );
//   itemRoutes(app);
// };


// Import necessary modules
import express, { Application, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import fs from "fs";
import yaml from "js-yaml";
import {itemRoutes} from "./routes/itemRoutes";


// Define the function to setup Swagger and routes
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
    apis: ["src/routes/*.ts"],  // Make sure this path matches where your route files are
  };

  const swaggerSpec = swaggerJsdoc(options);

  // Swagger UI setup
  app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, { explorer: true })
  );

  // Route to serve JSON format of the Swagger document
  app.get("/swagger.json", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Route to serve YAML format of the Swagger document
  app.get("/swagger.yaml", (req, res) => {
    res.setHeader('Content-Type', 'text/yaml');
    const yamlSpec = yaml.dump(swaggerSpec);
    res.send(yamlSpec);
  });

  // Setup item routes
  itemRoutes(app);
};