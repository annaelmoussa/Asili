"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const UnauthorizedError_1 = require("../errors/UnauthorizedError");
const errorHandler = (err, req, res, next) => {
    let status = err.status ?? 500;
    let message = err.message || "Something went wrong";
    if (err instanceof UnauthorizedError_1.UnauthorizedError) {
        status = err.status;
        message = err.message;
    }
    console.error(`[Error] ${status} - ${message}`);
    res.status(status).json({
        status: "error",
        statusCode: status,
        message,
    });
};
exports.errorHandler = errorHandler;
