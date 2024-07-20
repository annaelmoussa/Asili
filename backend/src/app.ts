import express from "express";
import helmet from "helmet";
import cors from "cors";
import { RegisterRoutes } from "../build/routes";
import { errorHandler } from "./middlewares/errorHandler";
import { loginRateLimiter } from "./middlewares/rateLimiter";
import path from "path";

export const app = express();
const corsOptions = {
  origin: "http://localhost:8080",
  credentials: true,
};

// Middleware Configuration
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/auth/login", loginRateLimiter);

app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "uploads"), {
    dotfiles: "deny",
    index: false,
    setHeaders: (res) => {
      res.set("Cache-Control", "public, max-age=3600");
      res.set("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

// Registering the routes
RegisterRoutes(app);

// Error handling
app.use(errorHandler);
