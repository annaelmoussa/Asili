"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRoutes = void 0;
const itemRoutes_1 = require("./itemRoutes");
const setupRoutes = (app) => {
    (0, itemRoutes_1.itemRoutes)(app);
};
exports.setupRoutes = setupRoutes;
