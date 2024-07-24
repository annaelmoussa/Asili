import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Put,
  Route,
  SuccessResponse,
  Tags,
  Delete,
  Security,
  Request,
  OperationId,
} from "tsoa";
import { IUser } from "../interfaces/IUser";
import { UserService } from "../services/userService";
import bcrypt from "bcrypt";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import { UnauthorizedError } from "../errors/UnauthorizedError";

@Security("jwt")
@Route("users")
@Tags("User")
export class UserController extends Controller {
  private userService: UserService = new UserService();

  @Security("jwt")
  @Get("{userId}")
  @OperationId("getUserById")
  public async getUser(
    @Path() userId: string,
    @Request() request: AuthenticatedRequest
  ): Promise<IUser | null> {
    await this.checkAuthorization(request, userId);
    return this.userService.get(userId);
  }

  @Security("jwt", ["ROLE_ADMIN"])
  @Get()
  @OperationId("getAllUsers")
  public async getUsers(
    @Request() request: AuthenticatedRequest
  ): Promise<IUser[]> {
    return this.userService.getAll();
  }

  @SuccessResponse("201", "Created")
  @Post()
  @OperationId("createUser")
  public async createUser(@Body() requestBody: IUser): Promise<IUser> {
    if (requestBody.password) {
      requestBody.password = await bcrypt.hash(requestBody.password, 10);
    }
    this.setStatus(201);
    return this.userService.create(requestBody);
  }

  @Security("jwt")
  @Put("{userId}")
  @OperationId("updateUser")
  public async updateUser(
    @Path() userId: string,
    @Body() requestBody: Partial<IUser>,
    @Request() request: AuthenticatedRequest
  ): Promise<IUser | null> {
    await this.checkAuthorization(request, userId);
    if (requestBody.password) {
      requestBody.password = await bcrypt.hash(requestBody.password, 10);
    }
    return this.userService.update(userId, requestBody);
  }

  @Security("jwt")
  @Delete("{userId}")
  @OperationId("deleteUser")
  public async deleteUser(
    @Path() userId: string,
    @Request() request: AuthenticatedRequest
  ): Promise<void> {
    await this.checkAuthorization(request, userId);
    return this.userService.softDelete(userId);
  }

  private async checkAuthorization(
    request: AuthenticatedRequest,
    userId: string
  ): Promise<void> {
    const requestingUserId = request.user.id;
    const userRole = request.user.role;

    if (userRole === "ROLE_ADMIN") {
      return; 
    }

    if (requestingUserId !== userId) {
      throw new UnauthorizedError(
        "You are not authorized to perform this action on another user's account"
      );
    }
  }

  @Security("jwt")
  @Get("password-status")
  @OperationId("getPasswordStatus")
  public async getPasswordStatus(
    @Request() request: AuthenticatedRequest
  ): Promise<{ needsChange: boolean }> {
    const userId = request.user.id;
    const needsChange = await new UserService().shouldChangePassword(userId);
    return { needsChange };
  }
}
