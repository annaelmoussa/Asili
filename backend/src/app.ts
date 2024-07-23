import express from "express";
import helmet from "helmet";
import cors from "cors";
import { RegisterRoutes } from "../build/routes";
import { errorHandler } from "./middlewares/errorHandler";
import bodyParser from "body-parser";
import { loginRateLimiter } from "./middlewares/rateLimiter";
import path from "path";

export const app = express();

const isProd = process.env.NODE_ENV === "production";
const corsOptions = {
  origin: isProd ? "https://littleyarns.org" : "http://localhost:8080",
  credentials: true,
};
app.use("/stripe-webhook", bodyParser.raw({ type: "application/json" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware Configuration
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         ...helmet.contentSecurityPolicy.getDefaultDirectives(),
//         "img-src": [
//           "'self'",
//           "data:",
//           "https://flagcdn.com",
//           "https://api.littleyarns.org",
//         ],
//       },
//     },
//   })
// );
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use("/auth/login", loginRateLimiter);

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
