"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRoutes = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const itemRoutes_1 = require("./routes/itemRoutes");
const setupRoutes = (app) => {
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
        apis: ["./routes/*.ts"],
    };
    const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec, { explorer: true }));
    (0, itemRoutes_1.itemRoutes)(app);
};
exports.setupRoutes = setupRoutes;
