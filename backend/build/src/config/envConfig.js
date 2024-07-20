"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = exports.POSTGRES_URI = exports.MONGO_URI = exports.PORT = void 0;
require("dotenv").config();
exports.PORT = process.env.PORT ?? 3000;
exports.MONGO_URI = process.env.MONGO_URI;
exports.POSTGRES_URI = process.env.POSTGRES_URI;
exports.JWT_SECRET = process.env.JWT_SECRET;
