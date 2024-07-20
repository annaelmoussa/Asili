"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("../build/routes");
const errorHandler_1 = require("./middlewares/errorHandler");
const rateLimiter_1 = require("./middlewares/rateLimiter");
const path_1 = __importDefault(require("path"));
exports.app = (0, express_1.default)();
const isProd = process.env.NODE_ENV === "production";
const corsOptions = {
    origin: isProd ? "https://littleyarns.org" : "http://localhost:8080",
    credentials: true,
};
// Middleware Configuration
exports.app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            ...helmet_1.default.contentSecurityPolicy.getDefaultDirectives(),
            "img-src": [
                "'self'",
                "data:",
                "https://flagcdn.com",
                "https://cdn.midjourney.com",
            ],
        },
    },
}));
exports.app.use((0, cors_1.default)(corsOptions));
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use(express_1.default.json());
exports.app.use("/auth/login", rateLimiter_1.loginRateLimiter);
exports.app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "..", "uploads"), {
    dotfiles: "deny",
    index: false,
    setHeaders: (res) => {
        res.set("Cache-Control", "public, max-age=3600");
        res.set("Cross-Origin-Resource-Policy", "cross-origin");
    },
}));
// Registering the routes
(0, routes_1.RegisterRoutes)(exports.app);
// Error handling
exports.app.use(errorHandler_1.errorHandler);
