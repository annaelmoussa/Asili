import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Put,
  Delete,
  Route,
  SuccessResponse,
  Security,
} from "tsoa";
import { ICategory, CategoryCreationParams } from "../interfaces/ICategory";
import { CategoryService } from "../services/categoryService";

@Route("categories")
export class CategoryController extends Controller {
  private categoryService: CategoryService;

  constructor() {
    super();
    this.categoryService = new CategoryService();
  }

  @Get()
  public async getCategories(): Promise<ICategory[]> {
    return this.categoryService.getAll();
  }

  @Get("{categoryId}")
  public async getCategory(
    @Path() categoryId: string
  ): Promise<ICategory | null> {
    return this.categoryService.get(categoryId);
  }

  @Security("jwt", ["ROLE_ADMIN"])
  @SuccessResponse("201", "Created")
  @Post()
  public async createCategory(
    @Body() requestBody: CategoryCreationParams
  ): Promise<ICategory> {
    this.setStatus(201);
    return this.categoryService.create(requestBody);
  }

  @Security("jwt", ["ROLE_ADMIN"])
  @Put("{categoryId}")
  public async updateCategory(
    @Path() categoryId: string,
    @Body() requestBody: Partial<ICategory>
  ): Promise<ICategory | null> {
    return this.categoryService.update(categoryId, requestBody);
  }

  @Security("jwt", ["ROLE_ADMIN"])
  @Delete("{categoryId}")
  public async deleteCategory(
    @Path() categoryId: string
  ): Promise<string | void> {
    const result = await this.categoryService.delete(categoryId);
    if (!result.success) {
      this.setStatus(400); // Bad Request
      return result.message;
    }
    this.setStatus(204); // No Content
  }
}
