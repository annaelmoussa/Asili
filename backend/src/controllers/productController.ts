import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Route,
  SuccessResponse,
} from "tsoa";
import { IProduct } from "../interfaces/IProduct";
import {
  ProductCreationParams,
  ProductService,
} from "../services/productService";

@Route("products")
export class ProductController extends Controller {
  @Get("{productId}")
  public async getProduct(@Path() productId: string): Promise<IProduct | null> {
    return new ProductService().get(productId);
  }

  @Get()
  public async getProducts(): Promise<IProduct[]> {
    return new ProductService().getAll();
  }

  @SuccessResponse("201", "Created")
  @Post()
  public async createProduct(
    @Body() requestBody: ProductCreationParams
  ): Promise<IProduct> {
    this.setStatus(201);
    return new ProductService().create(requestBody);
  }
}
