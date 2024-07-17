import { Request } from "express";
import { verify, Secret, JwtPayload } from "jsonwebtoken";
import { AuthService } from "./services/authService";
import { IJwtPayload } from "./interfaces/IJwtPayload";
import { UserService } from "./services/userService";

const authService = new AuthService();
const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error("JWT_SECRET is not defined");
}

export function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[]
): Promise<JwtPayload | string> {
  if (securityName === "jwt") {
    const token = request.headers["authorization"]?.split(" ")[1];

    return new Promise<JwtPayload | string>((resolve, reject) => {
      if (!token) {
        reject(new Error("No token provided"));
        return;
      }

      authService.isTokenBlacklisted(token).then((isBlacklisted) => {
        if (isBlacklisted) {
          reject(new Error("Token is blacklisted"));
          return;
        }

        verify(token, secret as Secret, (err, decoded) => {
          if (err) {
            reject(err);
            return;
          }

          if (!decoded) {
            reject(new Error("Failed to decode token"));
            return;
          }

          if (typeof decoded !== "string") {
            const jwtPayload = decoded as IJwtPayload;
            (request as Request & { user: IJwtPayload }).user = jwtPayload;

            if (scopes && scopes.length > 0) {
              const tokenScopes = jwtPayload.scopes as string[];

              const hasRequiredScope = scopes.some((requiredScope) => {
                const [scope1, scope2] = requiredScope.split("|");
                return (
                  tokenScopes.includes(scope1) ||
                  (scope2 && tokenScopes.includes(scope2))
                );
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
