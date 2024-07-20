"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = void 0;
// errors/UnauthorizedError.ts
class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.name = "UnauthorizedError";
        this.status = 403;
    }
}
exports.UnauthorizedError = UnauthorizedError;
