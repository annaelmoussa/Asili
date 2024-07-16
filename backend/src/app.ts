import express from "express";
import helmet from "helmet";
import cors from "cors";
import { RegisterRoutes } from "../build/routes";
import { errorHandler } from "./middlewares/errorHandler";
import bodyParser from "body-parser";
import { loginRateLimiter } from "./middlewares/rateLimiter";

export const app = express();
const corsOptions = {
  origin: "http://localhost:8080",
  credentials: true,
};
app.use("/stripe-webhook", bodyParser.raw({type: 'application/json'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Middleware Configuration
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/auth/login", loginRateLimiter);

// Registering the routes
RegisterRoutes(app);

// Error handling
app.use(errorHandler);
