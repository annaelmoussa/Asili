import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Route,
  SuccessResponse,
  Security,
  Request,
} from "tsoa";
import { CartService } from "../services/cartService";
import { ICartItem } from "../interfaces/ICartItem";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";

interface CartItemUpdate {
  productId: string;
  quantity: number;
}

@Route("carts")
@Security("jwt")
export class CartController extends Controller {
  private cartService: CartService = new CartService();

  @Get("get-cart-items")
  public async getCartItems(
    @Request() request: AuthenticatedRequest
  ): Promise<ICartItem[] | null> {
    const userId = request.user.id;
    const cartId = await this.cartService.getCartIdByUserId(userId);
    if (!cartId) {
      return [];
    }
    return await this.cartService.getCartItems(cartId);
  }

  @SuccessResponse("201", "Created")
  @Post("add-item")
  public async addItem(
    @Body() requestBody: CartItemUpdate,
    @Request() request: AuthenticatedRequest
  ): Promise<ICartItem> {
    const userId = request.user.id;
    this.setStatus(201);
    return this.cartService.addItem(
      userId,
      requestBody.productId,
      requestBody.quantity
    );
  }

  @Delete("remove-item/{itemId}")
  public async removeItem(
    @Path() itemId: string,
    @Request() request: AuthenticatedRequest
  ): Promise<void> {
    await this.checkAuthorization(request, itemId);
    await this.cartService.removeItem(itemId);
    this.setStatus(200);
  }

  @Post("update-item-quantity/{itemId}/{quantity}")
  public async updateItemQuantity(
    @Path() itemId: string,
    @Path() quantity: number,
    @Request() request: AuthenticatedRequest
  ): Promise<ICartItem> {
    await this.checkAuthorization(request, itemId);
    console.log("Updating item quantity:", itemId, quantity);
    return this.cartService.updateItemQuantity(itemId, quantity);
  }

  @Post("clear-expired-reservations")
  public async clearExpiredReservations(
    @Request() request: AuthenticatedRequest
  ): Promise<void> {
    this.checkAdminAuthorization(request);
    await this.cartService.clearExpiredReservations();
    this.setStatus(200);
  }

  private async checkAuthorization(
    request: AuthenticatedRequest,
    itemId: string
  ): Promise<void> {
    const userId = request.user.id;
    const userRole = request.user.role;

    if (userRole === "ROLE_ADMIN") {
      return; 
    }

    const cartItem = await this.cartService.getCartItemById(itemId);
    if (!cartItem || cartItem.cart.userId !== userId) {
      throw new UnauthorizedError(
        "You are not authorized to perform this action"
      );
    }
  }

  private checkAdminAuthorization(request: AuthenticatedRequest): void {
    if (request.user.role !== "ROLE_ADMIN") {
      throw new UnauthorizedError("Only admins can perform this action");
    }
  }
}
