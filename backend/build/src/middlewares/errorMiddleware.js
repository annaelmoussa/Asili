"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    var _a;
    const status = (_a = err.status) !== null && _a !== void 0 ? _a : 500;
    const message = err.message || "Something went wrong";
    console.error(`[Error] ${status} - ${message}`);
    res.status(status).json({
        status: "error",
        statusCode: status,
        message,
    });
};
exports.errorHandler = errorHandler;
