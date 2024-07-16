import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Put,
  Delete,
  Query,
  Route,
  SuccessResponse,
} from "tsoa";
import { IProduct, ProductCreationParams } from "../interfaces/IProduct";
import { ProductService } from "../services/productService";
import { CategoryService } from "../services/categoryService";
import { BrandService } from "../services/brandService";

@Route("products")
export class ProductController extends Controller {
  private productService: ProductService;
  private categoryService: CategoryService;
  private brandService: BrandService;

  constructor() {
    super();
    this.productService = new ProductService();
    this.categoryService = new CategoryService();
    this.brandService = new BrandService();
  }

  @Get("categories")
  public async getCategories(): Promise<string[]> {
    console.log("Getting categories");
    return this.productService.getCategories();
  }

  @Get("brands")
  public async getBrands(): Promise<string[]> {
    return this.productService.getBrands();
  }

  @Get("search")
  public async searchProducts(
    @Query() query?: string,
    @Query() category?: string,
    @Query() brand?: string,
    @Query() minPrice?: string,
    @Query() maxPrice?: string,
    @Query() isPromotion?: string,
    @Query() inStock?: string
  ): Promise<IProduct[]> {
    console.log("Searching products with query:", query);

    let categoryId, brandId;
    if (category) {
      const categoryObj = await this.categoryService.getByName(category);
      categoryId = categoryObj?.id;
    }
    if (brand) {
      const brandObj = await this.brandService.getByName(brand);
      brandId = brandObj?.id;
    }

    const facets = {
      category: categoryId,
      brand: brandId,
      minPrice,
      maxPrice,
      isPromotion,
      inStock,
    };
    console.log("Facets:", facets);
    return this.productService.search(query, facets);
  }

  @Get("{productId}")
  public async getProduct(@Path() productId: string): Promise<IProduct | null> {
    return this.productService.get(productId);
  }

  @Get()
  public async getProducts(): Promise<IProduct[]> {
    return this.productService.getAll();
  }

  @SuccessResponse("201", "Created")
  @Post()
  public async createProduct(
    @Body() requestBody: ProductCreationParams
  ): Promise<IProduct> {
    this.setStatus(201);
    return this.productService.create(requestBody);
  }

  @Put("{productId}")
  public async updateProduct(
    @Path() productId: string,
    @Body() requestBody: Partial<IProduct>
  ): Promise<IProduct | null> {
    return this.productService.update(productId, requestBody);
  }

  @Delete("{productId}")
  public async deleteProduct(@Path() productId: string): Promise<void> {
    await this.productService.delete(productId);
  }
}
