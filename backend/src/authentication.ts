import { Request } from "express";
import { verify, Secret, JwtPayload } from "jsonwebtoken";
import { AuthService } from "./services/authService";
import { IJwtPayload } from "./interfaces/IJwtPayload";
import { UserService } from "./services/userService";
import { IUser } from "./interfaces/IUser";

const authService = new AuthService();
const userService = new UserService();
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

    return new Promise<JwtPayload | string>(async (resolve, reject) => {
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

        verify(token, secret as Secret, async (err, decoded) => {
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

            // Create a user object that satisfies both IUser and IJwtPayload
            const user: IUser & IJwtPayload = {
              ...jwtPayload,
              password: "", // Set a default value or fetch from database if needed
            };

            (request as Request & { user: IUser & IJwtPayload }).user = user;

            if (scopes && scopes.length > 0) {
              const tokenScopes = jwtPayload.scopes || [];

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

            try {
              const needsChange = await userService.shouldChangePassword(
                jwtPayload.id
              );
              if (needsChange) {
                reject(new Error("Password change required"));
                return;
              }
            } catch (error) {
              reject(error);
              return;
            }
          }

          resolve(decoded);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  return Promise.reject(new Error("Unsupported security name"));
}
