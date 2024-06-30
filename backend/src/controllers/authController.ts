import {
  Body,
  Controller,
  Get,
  Post,
  Route,
  Tags,
  Request,
  OperationId,
} from "tsoa";
import { AuthService } from "../services/authService";
import { IUser } from "../interfaces/IUser";

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  email: string;
  password: string;
}

interface LogoutRequest {
  token: string;
}

@Route("auth")
@Tags("Auth")
export class AuthController extends Controller {
  @Post("login")
  @OperationId("loginUser")
  public async login(
    @Body() body: LoginRequest
  ): Promise<{ user: IUser; token: string }> {
    const authService = new AuthService();
    try {
      return await authService.login(body.email, body.password);
    } catch (error) {
      this.setStatus(401);
      throw new Error("Invalid email or password");
    }
  }

  @Post("signup")
  @OperationId("signupUser")
  public async signup(@Body() body: SignupRequest): Promise<IUser> {
    const authService = new AuthService();
    return authService.signup(body.email, body.password);
  }

  @Post("logout")
  @OperationId("logoutUser")
  public async logout(@Body() body: LogoutRequest): Promise<void> {
    const authService = new AuthService();
    await authService.logout(body.token);
  }

  @Get("user")
  @OperationId("getAuthenticatedUser")
  public async getUser(@Request() request: any): Promise<IUser | null> {
    const token = request.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new Error("Token is missing");
    }
    const authService = new AuthService();
    return authService.getUser(token);
  }
}
