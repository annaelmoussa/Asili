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
} from "tsoa";
import { IUser } from "../interfaces/IUser";
import { UserService } from "../services/userService";

@Route("users")
@Tags("User")
export class UserController extends Controller {
  @Security("jwt")
  @Get("{userId}")
  public async getUser(
    @Path() userId: string,
    @Request() request: any
  ): Promise<IUser | null> {
    return new UserService().get(userId);
  }

  @Security("jwt")
  @Get()
  public async getUsers(@Request() request: any): Promise<IUser[]> {
    return new UserService().getAll();
  }

  @SuccessResponse("201", "Created")
  @Post()
  public async createUser(@Body() requestBody: IUser): Promise<IUser> {
    this.setStatus(201);
    return new UserService().create(requestBody);
  }

  @Security("jwt")
  @Put("{userId}")
  public async updateUser(
    @Path() userId: string,
    @Body() requestBody: IUser,
    @Request() request: any
  ): Promise<IUser | null> {
    return new UserService().update(userId, requestBody);
  }

  @Security("jwt")
  @Delete("{userId}")
  public async deleteUser(
    @Path() userId: string,
    @Request() request: any
  ): Promise<void> {
    return new UserService().delete(userId);
  }
}
