// src/app.ts
import express from "express";
import helmet from "helmet";
import cors from "cors";
import { RegisterRoutes } from "../build/routes";
import { errorHandler } from "./middlewares/errorHandler";

export const app = express();
app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Enregistrer les routes générées par TSOA
RegisterRoutes(app);

// Middleware de gestion des erreurs
app.use(errorHandler);
