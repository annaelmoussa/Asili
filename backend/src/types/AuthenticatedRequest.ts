import { Request } from "express";
import { IJwtPayload } from "../interfaces/IJwtPayload";

export type AuthenticatedRequest = Request & { user: IJwtPayload };
