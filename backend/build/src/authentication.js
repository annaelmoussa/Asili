"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressAuthentication = expressAuthentication;
const jsonwebtoken_1 = require("jsonwebtoken");
const authService_1 = require("./services/authService");
const userService_1 = require("./services/userService");
const authService = new authService_1.AuthService();
const userService = new userService_1.UserService();
const secret = process.env.JWT_SECRET;
if (!secret) {
    throw new Error("JWT_SECRET is not defined");
}
function expressAuthentication(request, securityName, scopes) {
    if (securityName === "jwt") {
        const token = request.headers["authorization"]?.split(" ")[1];
        return new Promise(async (resolve, reject) => {
            if (!token) {
                reject(new Error("No token provided"));
                return;
            }
            try {
                const isBlacklisted = await authService.isTokenBlacklisted(token);
                if (isBlacklisted) {
                    reject(new Error("Token is blacklisted"));
                    return;
                }
                (0, jsonwebtoken_1.verify)(token, secret, async (err, decoded) => {
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
                        // Create a user object that satisfies both IUser and IJwtPayload
                        const user = {
                            ...jwtPayload,
                            password: "", // Set a default value or fetch from database if needed
                        };
                        request.user = user;
                        if (scopes && scopes.length > 0) {
                            const tokenScopes = jwtPayload.scopes || [];
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
                        try {
                            const needsChange = await userService.shouldChangePassword(jwtPayload.id);
                            if (needsChange) {
                                reject(new Error("Password change required"));
                                return;
                            }
                        }
                        catch (error) {
                            reject(error);
                            return;
                        }
                    }
                    resolve(decoded);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    return Promise.reject(new Error("Unsupported security name"));
}
