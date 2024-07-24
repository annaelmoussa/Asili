import express from "express";
import helmet from "helmet";
import cors from "cors";
import { RegisterRoutes } from "../build/routes";
import { errorHandler } from "./middlewares/errorHandler";
import bodyParser from "body-parser";
import path from "path";

export const app = express();

const isProd = process.env.NODE_ENV === "production";
const corsOptions = {
  origin: isProd ? "https://littleyarns.org" : "http://localhost:8080",
  credentials: true,
};

// Middleware Configuration
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": [
          "'self'",
          "data:",
          "https://flagcdn.com",
          "https://cdn.midjourney.com",
        ],
      },
    },
  })
);

// Special handling for Stripe webhook route
app.use(
  "/stripe-webhook",
  express.raw({ type: "application/json" }),
  cors({ origin: "*" }) // Allow Stripe to call from any origin
);

// General CORS for other routes
app.use(cors(corsOptions));

// Body parsing for other routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
