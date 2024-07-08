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

@Route("products")
export class ProductController extends Controller {
  private productService: ProductService;

  constructor() {
    super();
    this.productService = new ProductService();
  }

  @Get("search")
  public async searchProducts(
    @Query() query?: string,
    @Query() category?: string,
    @Query() brand?: string,
    @Query() minPrice?: number,
    @Query() maxPrice?: number,
    @Query() isPromotion?: boolean,
    @Query() inStock?: boolean
  ): Promise<IProduct[]> {
    console.log("Searching products with query:", query);
    const facets = {
      category,
      brand,
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
