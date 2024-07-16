import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Route,
  SuccessResponse,
  Put,
} from "tsoa";
import { CartService } from "../services/cartService";
import { ICart } from "../interfaces/ICart";
import { ICartItem } from "../interfaces/ICartItem";
import cartItem from "@/models/CartItem";

interface CartItemUpdate {
  productId: string;
  quantity: number;
}

interface CartUpdate {
  items: CartItemUpdate[];
}

@Route("carts")
export class CartController extends Controller {
  private cartService: CartService = new CartService();

  @Get("get-cart-items/{userId}")
  public async getCartItems(
    @Path() userId: string
  ): Promise<ICartItem[] | null> {
    const cartId = await this.cartService.getCartIdByUserId(userId);
    if (!cartId) {
      return [];
    }
    return await this.cartService.getCartItems(cartId);
  }

  @SuccessResponse("201", "Created")
  @Post("add-item/{userId}")
  public async addItem(
    @Path() userId: string,
    @Body() requestBody: CartItemUpdate
  ): Promise<ICartItem> {
    this.setStatus(201);
    return this.cartService.addItem(
      userId,
      requestBody.productId,
      requestBody.quantity
    );
  }

  @Delete("remove-item/{itemId}")
  public async removeItem(@Path() itemId: string): Promise<void> {
    await this.cartService.removeItem(itemId);
    this.setStatus(200);
  }

  @Post("update-item-quantity/{itemId}/{quantity}")
  public async updateItemQuantity(
    @Path() itemId: string,
    @Path() quantity: number
  ): Promise<ICartItem> {
    console.log("Updating item quantity:", itemId, quantity);
    return this.cartService.updateItemQuantity(itemId, quantity);
  }
}
