"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressAuthentication = expressAuthentication;
const jsonwebtoken_1 = require("jsonwebtoken");
const authService_1 = require("./services/authService");
const authService = new authService_1.AuthService();
const secret = process.env.JWT_SECRET;
if (!secret) {
    throw new Error("JWT_SECRET is not defined");
}
function expressAuthentication(request, securityName, scopes) {
    if (securityName === "jwt") {
        const token = request.headers["authorization"]?.split(" ")[1];
        return new Promise((resolve, reject) => {
            if (!token) {
                reject(new Error("No token provided"));
                return;
            }
            authService.isTokenBlacklisted(token).then((isBlacklisted) => {
                if (isBlacklisted) {
                    reject(new Error("Token is blacklisted"));
                    return;
                }
                (0, jsonwebtoken_1.verify)(token, secret, (err, decoded) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (!decoded) {
                        reject(new Error("Failed to decode token"));
                        return;
                    }
                    if (typeof decoded !== "string") {
                        const jwtPayload = decoded;
                        request.user = jwtPayload;
                        if (scopes && scopes.length > 0) {
                            const tokenScopes = jwtPayload.scopes;
                            const hasRequiredScope = scopes.some((requiredScope) => {
                                const [scope1, scope2] = requiredScope.split("|");
                                return (tokenScopes.includes(scope1) ||
                                    (scope2 && tokenScopes.includes(scope2)));
                            });
                            if (!hasRequiredScope) {
                                reject(new Error("JWT does not contain required scope."));
                                return;
                            }
                        }
                    }
                    resolve(decoded);
                });
            });
        });
    }
    return Promise.reject(new Error("Unsupported security name"));
}
