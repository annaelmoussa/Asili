import * as express from "express";
import * as jwt from "jsonwebtoken";
import { AuthService } from "./services/authService";
import { IJwtPayload } from "./interfaces/IJwtPayload";

const authService = new AuthService();
const secret = process.env.JWT_SECRET || "your_jwt_secret";

export function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  if (securityName === "jwt") {
    const token = request.headers["authorization"]?.split(" ")[1];

    return new Promise(async (resolve, reject) => {
      if (!token) {
        return reject(new Error("No token provided"));
      }

      const isBlacklisted = await authService.isTokenBlacklisted(token);
      if (isBlacklisted) {
        return reject(new Error("Token is blacklisted"));
      }

      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          return reject(err);
        }

        if (decoded && typeof decoded !== "string" && scopes) {
          const jwtPayload = decoded as IJwtPayload;
          const tokenScopes = jwtPayload.scopes as string[];
          if (
            !tokenScopes ||
            !scopes.every((scope) => tokenScopes.includes(scope))
          ) {
            return reject(new Error("JWT does not contain required scope."));
          }
        }

        if (decoded && typeof decoded !== "string") {
          const jwtPayload = decoded as IJwtPayload;
          (request as any).user = jwtPayload;
        }

        resolve(decoded);
      });
    });
  }

  return Promise.reject(new Error("Unsupported security name"));
}
