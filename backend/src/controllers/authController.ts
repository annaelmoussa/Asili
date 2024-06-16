import { Body, Controller, Get, Post, Route, Tags, Request } from "tsoa";
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
  public async login(
    @Body() body: LoginRequest
  ): Promise<{ user: IUser; token: string }> {
    const authService = new AuthService();
    return authService.login(body.email, body.password);
  }

  @Post("signup")
  public async signup(@Body() body: SignupRequest): Promise<IUser> {
    const authService = new AuthService();
    return authService.signup(body.email, body.password);
  }

  @Post("logout")
  public async logout(@Body() body: LogoutRequest): Promise<void> {
    const authService = new AuthService();
    await authService.logout(body.token);
  }

  @Get("user")
  public async getUser(@Request() request: any): Promise<IUser | null> {
    const token = request.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new Error("Token is missing");
    }
    const authService = new AuthService();
    return authService.getUser(token);
  }
}
