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
import { IBrand, BrandCreationParams } from "../interfaces/IBrand";
import { BrandService } from "../services/brandService";
import { HttpError } from "../types/HttpError";

@Route("brands")
export class BrandController extends Controller {
  private brandService: BrandService;

  constructor() {
    super();
    this.brandService = new BrandService();
  }

  @Get()
  public async getBrands(): Promise<IBrand[]> {
    return this.brandService.getAll();
  }

  @Get("{brandId}")
  public async getBrand(@Path() brandId: string): Promise<IBrand | null> {
    return this.brandService.get(brandId);
  }

  @SuccessResponse("201", "Created")
  @Post()
  public async createBrand(
    @Body() requestBody: BrandCreationParams
  ): Promise<IBrand> {
    this.setStatus(201);
    return this.brandService.create(requestBody);
  }

  @Put("{brandId}")
  public async updateBrand(
    @Path() brandId: string,
    @Body() requestBody: Partial<IBrand>
  ): Promise<IBrand> {
    console.log(
      "Updating brand:",
      brandId,
      "with body:",
      JSON.stringify(requestBody)
    );
    try {
      const updatedBrand = await this.brandService.update(brandId, requestBody);
      console.log("Brand updated successfully:", JSON.stringify(updatedBrand));
      return updatedBrand;
    } catch (error) {
      console.error("Error in updateBrand controller:", error);
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError(500, "Error updating brand");
    }
  }

  @Delete("{brandId}")
  public async deleteBrand(@Path() brandId: string): Promise<string | void> {
    const result = await this.brandService.delete(brandId);
    if (!result.success) {
      this.setStatus(400); // Bad Request
      return result.message;
    }
    this.setStatus(204); // No Content
  }
}
