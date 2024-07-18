import { Body, Controller, Get, Post, Route, Tags, Request, Query, SuccessResponse, OperationId } from "tsoa";
import { AuthService } from "../services/authService";
import { IUser } from "../interfaces/IUser";

interface ResendConfirmationRequest {
  email: string;
}

interface ResetPasswordRequest {
  email: string;
}
interface UpdatePasswordRequest {
  token: string;
  password: string;
  confirm_password: string;
}

interface LogoutRequest {
  token: string;
}

interface RegisterResponse {
  message: string;
}

interface LoginRequest {
  email: string;
  password: string;
}
interface SignupRequest {
  email: string;
  password: string;
}

interface ChangePasswordRequest {
  password: string;
  confirm_password: string;
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
      throw new Error((error as Error).message);
    }
  }

  @Post("signup")
  @OperationId("signupUser")
  @SuccessResponse("201", "Created")
  public async signup(@Body() body: SignupRequest): Promise<RegisterResponse> {
    const authService = new AuthService();
    await authService.signup(body.email, body.password);
    this.setStatus(201);
    return { message: "User registered. Please check your email to confirm your account." };
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

  @Get("confirm")
  @SuccessResponse("200", "Email confirmed successfully")
  public async confirmEmail(@Query() token: string): Promise<{ message: string }> {
    const authService = new AuthService();
    const user = await authService.confirmEmail(token);
    if (user) {
      return { message: "Email confirmed successfully" };
    } else {
      this.setStatus(400);
      return { message: "Invalid or expired token" };
    }
  }

  @Post("resend-confirmation-email")
  public async resendConfirmationEmail(@Body() body: ResendConfirmationRequest): Promise<{ message: string }> {
    const authService = new AuthService();
    await authService.resendConfirmationEmail(body.email);
    return { message: "A new confirmation email has been sent. Please check your email." };
  }

  @Post("reset-password-request")
  public async resetPasswordRequest(@Body() body: ResetPasswordRequest): Promise<{ message: string }> {
    const authService = new AuthService();
    await authService.sendPasswordResetEmail(body.email);
    return { message: "If an account with that email exists, a password reset link has been sent." };
  }

  @Post("reset-password")
  public async resetPassword(@Body() body: UpdatePasswordRequest): Promise<{ message: string }> {
    console.log(body);
    const authService = new AuthService();
    await authService.resetPassword(body.token, body.password, body.confirm_password);
    return { message: "Password has been reset successfully." };
  }
}
