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

@Route("users")
@Tags("User")
export class UserController extends Controller {
  @Security("jwt")
  @Get("{userId}")
  @OperationId("getUserById")
  public async getUser(
    @Path() userId: string,
    @Request() request: any
  ): Promise<IUser | null> {
    return new UserService().get(userId);
  }

  @Security("jwt")
  @Get()
  @OperationId("getAllUsers")
  public async getUsers(@Request() request: any): Promise<IUser[]> {
    return new UserService().getAll();
  }

  @SuccessResponse("201", "Created")
  @Post()
  @OperationId("createUser")
  public async createUser(@Body() requestBody: IUser): Promise<IUser> {
    this.setStatus(201);
    return new UserService().create(requestBody);
  }

  @Security("jwt")
  @Put("{userId}")
  @OperationId("updateUser")
  public async updateUser(
    @Path() userId: string,
    @Body() requestBody: Partial<IUser>,
    @Request() request: any
  ): Promise<IUser | null> {
    return new UserService().update(userId, requestBody);
  }

  @Security("jwt")
  @Delete("{userId}")
  @OperationId("deleteUser")
  public async deleteUser(
    @Path() userId: string,
    @Request() request: any
  ): Promise<void> {
    return new UserService().softDelete(userId);
  }

  @Security("jwt")
  @Get("password-status")
  @OperationId("getPasswordStatus")
  public async getPasswordStatus(@Request() request: any): Promise<{ needsChange: boolean }> {
    const userId = (request as any).user.id;
    const needsChange = await new UserService().shouldChangePassword(userId);
    return { needsChange };
  }
}
