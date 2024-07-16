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

  @SuccessResponse("201", "Created")
  @Post()
  public async createCategory(
    @Body() requestBody: CategoryCreationParams
  ): Promise<ICategory> {
    this.setStatus(201);
    return this.categoryService.create(requestBody);
  }

  @Put("{categoryId}")
  public async updateCategory(
    @Path() categoryId: string,
    @Body() requestBody: Partial<ICategory>
  ): Promise<ICategory | null> {
    return this.categoryService.update(categoryId, requestBody);
  }

  @Delete("{categoryId}")
  public async deleteCategory(@Path() categoryId: string): Promise<void> {
    await this.categoryService.delete(categoryId);
  }
}
