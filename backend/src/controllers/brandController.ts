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
  ): Promise<IBrand | null> {
    return this.brandService.update(brandId, requestBody);
  }

  @Delete("{brandId}")
  public async deleteBrand(@Path() brandId: string): Promise<void> {
    await this.brandService.delete(brandId);
  }
}
