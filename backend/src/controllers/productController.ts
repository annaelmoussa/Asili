import path from "path";
import multer from "multer";
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
  Security,
  UploadedFile,
  FormField,
  Request,
} from "tsoa";
import { IProduct, ProductCreationParams } from "../interfaces/IProduct";
import { ProductService } from "../services/productService";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { AuthenticatedRequest } from "@/types/AuthenticatedRequest";
import {AlertService}  from "../services/AlertService";
import Product  from "../models/Product";
import { ICategory } from "../interfaces/ICategory";

@Route("products")
export class ProductController extends Controller {
  private productService: ProductService;
  private alertService: AlertService;

  constructor() {
    super();
    this.productService = new ProductService();
    this.alertService = new AlertService();
  }

  upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith("image/")) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error("Not an image! Please upload an image.") as Error);
      }
    },
  });

  async saveFile(file: Express.Multer.File): Promise<string> {
    const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
    const filePath = path.join(__dirname, "../../uploads/", fileName);

    try {
      if (!file.mimetype.startsWith("image/")) {
        throw new Error("Invalid file type. Only images are allowed.");
      }

      await fs.promises.writeFile(filePath, file.buffer);
      return `/uploads/${fileName}`;
    } catch (error) {
      console.error("Error saving file:", error);
      throw new Error("Failed to save file");
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    const fullPath = path.join(__dirname, "../../", filePath);
    try {
      await fs.promises.unlink(fullPath);
    } catch (error) {
      console.error("Error deleting file:", error);
      throw new Error("Failed to delete file");
    }
  }

  @Get("low-stock")
  public async getLowStockProducts(): Promise<IProduct[]> {
    return this.productService.getLowStockProducts();
  }

  @Get("categories")
  public async getCategories(): Promise<string[]> {
    return this.productService.getCategories();
  }

  @Get("categories-with-id")
  public async getCategoriesWithId(): Promise<ICategory[]> {
    return this.productService.getCategoriesWithId();
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
    const facets = {
      category,
      brand,
      minPrice,
      maxPrice,
      isPromotion,
      inStock,
    };
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
  @Security("jwt", ["ROLE_ADMIN"])
  @Post()
  public async createProduct(
    @FormField() name: string,
    @FormField() description: string,
    @FormField() price: number,
    @FormField() categoryId: string,
    @FormField() brandId: string,
    @FormField() stock: number,
    @FormField() isPromotion: boolean,
    @FormField() lowStockThreshold: number,
    @UploadedFile() image?: Express.Multer.File
  ): Promise<IProduct> {
    const productData: ProductCreationParams = {
      name,
      description,
      price,
      categoryId,
      brandId,
      stock,
      isPromotion,
      lowStockThreshold,
    };

    let imagePath;
    if (image && image.buffer) {
      try {
        imagePath = await this.saveFile(image);
      } catch (error) {
        console.error("Error saving image:", error);
        this.setStatus(500);
        throw new Error("Failed to save image");
      }
    }

    try {
      const product = await this.productService.create({
        ...productData,
        image: imagePath,
      });
      await this.alertService.sendNewProductInCategoryAlert(product);
      this.setStatus(201);
      return product;
    } catch (error) {
      if (imagePath) {
        try {
          await this.deleteFile(imagePath);
        } catch (deleteError) {
          console.error(
            "Error deleting image after failed product creation:",
            deleteError
          );
        }
      }
      console.error("Error creating product:", error);
      this.setStatus(400);
      throw error;
    }
  }

  @Put("{productId}")
  @Security("jwt", ["ROLE_ADMIN|ROLE_STORE_KEEPER"])
  public async updateProduct(
    @Path() productId: string,
    @FormField() name?: string,
    @FormField() description?: string,
    @FormField() price?: string,
    @FormField() categoryId?: string,
    @FormField() brandId?: string,
    @FormField() stock?: string,
    @FormField() isPromotion?: string,
    @FormField() lowStockThreshold?: string,
    @UploadedFile() image?: Express.Multer.File,
    @FormField() existingImageUrl?: string
  ): Promise<IProduct | null> {
    const updates: Partial<IProduct> = {};

    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (price !== undefined) updates.price = parseFloat(price);
    if (categoryId !== undefined) updates.categoryId = categoryId;
    if (brandId !== undefined) updates.brandId = brandId;
    if (stock !== undefined) updates.stock = parseInt(stock, 10);
    if (isPromotion !== undefined) updates.isPromotion = isPromotion === "true";
    if (lowStockThreshold !== undefined)
      updates.lowStockThreshold = parseInt(lowStockThreshold, 10);

    let newImagePath;
    if (image && image.buffer) {
      try {
        newImagePath = await this.saveFile(image);
        updates.image = newImagePath;
      } catch (error) {
        console.error("Error saving new image:", error);
        this.setStatus(500);
        throw new Error("Failed to save new image");
      }
    } else if (existingImageUrl) {
      updates.image = existingImageUrl;
    }

    try {
      const oldProduct = await this.productService.get(productId);
      const updatedProduct = await this.productService.update(
        productId,
        updates
      );
  
      if (!updatedProduct) {
        if (newImagePath) {
          await this.deleteFile(newImagePath);
        }
        this.setStatus(404);
        return null;
      }
      if (updatedProduct) {
        console.log("ouioui")
        const refreshedProduct = await Product.findByPk(updatedProduct.id);
        if (refreshedProduct) {
          if (stock !== undefined && oldProduct && oldProduct.stock === 0 && refreshedProduct.stock > 0) {
            await this.alertService.sendRestockAlert(refreshedProduct);
          }
  
          if (price !== undefined && oldProduct && oldProduct.price !== refreshedProduct.price) {
            await this.alertService.sendPriceChangeAlert(refreshedProduct, oldProduct.price);
          }
        }
      }

      if (
        newImagePath &&
        oldProduct &&
        oldProduct.image &&
        oldProduct.image !== existingImageUrl
      ) {
        try {
          await this.deleteFile(oldProduct.image);
        } catch (deleteError) {
          console.error("Error deleting old image:", deleteError);
        }
      }

      return updatedProduct;
    } catch (error) {
      if (newImagePath) {
        try {
          await this.deleteFile(newImagePath);
        } catch (deleteError) {
          console.error(
            "Error deleting new image after failed product update:",
            deleteError
          );
        }
      }
      console.error(`Error updating product ${productId}:`, error);
      this.setStatus(400);
      throw error;
    }
  }

  @Security("jwt", ["ROLE_ADMIN"])
  @Delete("{productId}")
  public async deleteProduct(@Path() productId: string): Promise<void> {
    await this.productService.delete(productId);
  }

  @Security("jwt", ["ROLE_ADMIN|ROLE_STORE_KEEPER"])
  @Put("{productId}/stock")
  public async updateStock(
    @Path() productId: string,
    @Body() body: { quantity: number }
  ): Promise<IProduct | null> {
    return this.productService.updateStock(productId, body.quantity);
  }

  @Security("jwt", ["ROLE_ADMIN|ROLE_STORE_KEEPER"])
  @Put("{productId}/low-stock-threshold")
  public async updateLowStockThreshold(
    @Path() productId: string,
    @Body() body: { lowStockThreshold: number }
  ): Promise<IProduct | null> {
    return this.productService.update(productId, {
      lowStockThreshold: body.lowStockThreshold,
    });
  }

  @Security("jwt", ["ROLE_ADMIN|ROLE_STORE_KEEPER"])
  @Get("{productId}/stock-history")
  public async getStockHistory(
    @Path() productId: string
  ): Promise<{ date: Date; quantity: number }[]> {
    return this.productService.getStockHistory(productId);
  }

  @Security("jwt")
  @Post("{productId}/subscribe-restock")
  public async subscribeToProductRestock(@Path() productId: string, @Request() request: AuthenticatedRequest): Promise<void> {
    const userId = request.user.id;
    await this.productService.subscribeToProductRestock(userId, productId);
  }

  @Security("jwt")
  @Post("{productId}/subscribe-price-change")
  public async subscribeToProductPriceChange(@Path() productId: string, @Request() request: AuthenticatedRequest): Promise<void> {
    const userId = request.user.id;
    await this.productService.subscribeToProductPriceChange(userId, productId);
  }

  @Security("jwt")
  @Post("categories/{categoryId}/subscribe-new-products")
  public async subscribeToCategoryNewProducts(@Path() categoryId: string, @Request() request: AuthenticatedRequest): Promise<void> {
    const userId = request.user.id;
    await this.productService.subscribeToCategoryNewProducts(userId, categoryId);
  }

  @Security("jwt")
  @Delete("{productId}/unsubscribe-restock")
  public async unsubscribeFromProductRestock(@Path() productId: string, @Request() request: AuthenticatedRequest): Promise<void> {
    const userId = request.user.id;
    await this.productService.unsubscribeFromProductRestock(userId, productId);
  }

  @Security("jwt")
  @Delete("{productId}/unsubscribe-price-change")
  public async unsubscribeFromProductPriceChange(@Path() productId: string, @Request() request: AuthenticatedRequest): Promise<void> {
    const userId = request.user.id;
    await this.productService.unsubscribeFromProductPriceChange(userId, productId);
  }

  @Security("jwt")
  @Delete("categories/{categoryId}/unsubscribe-new-products")
  public async unsubscribeFromCategoryNewProducts(@Path() categoryId: string, @Request() request: AuthenticatedRequest): Promise<void> {
    const userId = request.user.id;
    await this.productService.unsubscribeFromCategoryNewProducts(userId, categoryId);
  }

  @Security("jwt")
  @Get("{productId}/check-restock-subscription")
  public async checkProductRestockSubscription(
    @Path() productId: string, 
    @Request() request: AuthenticatedRequest
  ): Promise<{ isSubscribed: boolean }> {
    const userId = request.user.id;
    const isSubscribed = await this.productService.checkProductRestockSubscription(userId, productId);
    return { isSubscribed };
  }

  @Security("jwt")
  @Get("{productId}/check-price-change-subscription")
  public async checkProductPriceChangeSubscription(
    @Path() productId: string, 
    @Request() request: AuthenticatedRequest
  ): Promise<{ isSubscribed: boolean }> {
    const userId = request.user.id;
    const isSubscribed = await this.productService.checkProductPriceChangeSubscription(userId, productId);
    return { isSubscribed };
  }

  @Security("jwt")
  @Get("categories/{categoryId}/check-new-products-subscription")
  public async checkCategoryNewProductsSubscription(
    @Path() categoryId: string, 
    @Request() request: AuthenticatedRequest
  ): Promise<{ isSubscribed: boolean }> {
    const userId = request.user.id;
    const isSubscribed = await this.productService.checkCategoryNewProductsSubscription(userId, categoryId);
    return { isSubscribed };
  }
}
