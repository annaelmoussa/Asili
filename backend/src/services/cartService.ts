import Cart from "../models/Cart";
import CartItem from "../models/CartItem";
import Product from "../models/Product";
import User from "../models/User";
import { Op, Transaction } from "sequelize";
import { reservationExpirationQueue, stockReleaseQueue } from "../queues";
import db from "../models";
import { ICartItem } from "../interfaces/ICartItem";

export class CartService {
  private RESERVATION_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

  async getCartIdByUserId(userId: string): Promise<string | null> {
    const cart = await Cart.findOne({
      where: { userId },
      attributes: ["id"],
    });
    return cart ? cart.id : null;
  }

  async getCartItems(cartId: string): Promise<ICartItem[]> {
    try {
      const items = await CartItem.findAll({
        where: {
          cartId,
          [Op.or]: [
            { reservationExpires: null },
            { reservationExpires: { [Op.gt]: new Date() } },
          ],
        },
        include: [
          {
            model: Product,
            as: "product",
          },
        ],
      });
      console.log("Items fetched:", JSON.stringify(items, null, 2));
      return items;
    } catch (error) {
      console.error("Error fetching cart items:", error);
      throw error;
    }
  }

  async addItem(
    userId: string,
    productId: string,
    quantity: number
  ): Promise<ICartItem> {
    return db.sequelize.transaction(async (t: Transaction) => {
      const user = await User.findByPk(userId, { transaction: t });
      if (!user) {
        throw new Error("User not found");
      }

      const product = await Product.findByPk(productId, {
        transaction: t,
        lock: true,
      });
      if (!product) {
        throw new Error("Product not found");
      }

      if (product.stock < quantity) {
        throw new Error("Not enough stock");
      }

      const [cart] = await Cart.findOrCreate({
        where: { userId },
        transaction: t,
      });

      const [item, created] = await CartItem.findOrCreate({
        where: { cartId: cart.id, productId },
        defaults: {
          cartId: cart.id,
          productId: productId,
          quantity: 0,
          reservationExpires: new Date(Date.now() + this.RESERVATION_DURATION),
        },
        transaction: t,
      });

      const newQuantity = item.quantity + quantity;
      const stockReduction = quantity; // Only reduce stock by the new quantity added

      product.stock -= stockReduction;
      await product.save({ transaction: t });

      item.quantity = newQuantity;
      item.reservationExpires = new Date(
        Date.now() + this.RESERVATION_DURATION
      );
      await item.save({ transaction: t });

      try {
        await reservationExpirationQueue.add(
          { cartItemId: item.id, quantity: stockReduction },
          { delay: this.RESERVATION_DURATION }
        );
      } catch (error) {
        console.error("Failed to add reservation expiration job:", error);
      }

      return item;
    });
  }

  async removeItem(itemId: string): Promise<void> {
    return db.sequelize.transaction(async (t: Transaction) => {
      const item = await CartItem.findByPk(itemId, {
        transaction: t,
        include: [{ model: Product }],
      });

      if (!item) {
        throw new Error("Item not found");
      }

      const product = await Product.findByPk(item.productId, {
        transaction: t,
        lock: true,
      });
      if (!product) {
        throw new Error("Product not found");
      }

      // We don't modify the stock here, as it will be handled by the stockReleaseQueue

      await item.destroy({ transaction: t });

      try {
        await reservationExpirationQueue.removeJobs(itemId);
        await stockReleaseQueue.add({
          productId: item.productId,
          quantity: item.quantity,
        });
      } catch (error) {
        console.error("Failed to manage queue jobs:", error);
      }
    });
  }

  async updateItemQuantity(
    itemId: string,
    newQuantity: number
  ): Promise<ICartItem> {
    return db.sequelize.transaction(async (t: Transaction) => {
      const item = await CartItem.findByPk(itemId, {
        transaction: t,
        include: [{ model: Product }],
      });

      if (!item) {
        throw new Error("Item not found");
      }

      const product = await Product.findByPk(item.productId, {
        transaction: t,
        lock: true,
      });
      if (!product) {
        throw new Error("Product not found");
      }

      const quantityDiff = newQuantity - item.quantity;

      if (product.stock < quantityDiff) {
        throw new Error("Not enough stock");
      }

      product.stock -= quantityDiff;
      await product.save({ transaction: t });

      item.quantity = newQuantity;
      item.reservationExpires = new Date(
        Date.now() + this.RESERVATION_DURATION
      );
      await item.save({ transaction: t });

      try {
        await reservationExpirationQueue.removeJobs(itemId);
        await reservationExpirationQueue.add(
          { cartItemId: itemId, quantity: newQuantity },
          { delay: this.RESERVATION_DURATION }
        );
      } catch (error) {
        console.error("Failed to manage queue jobs:", error);
      }

      return item;
    });
  }

  async clearExpiredReservations(): Promise<void> {
    const expiredItems = await CartItem.findAll({
      where: {
        reservationExpires: {
          [Op.lt]: new Date(),
        },
      },
      include: [{ model: Product }],
    });

    for (const item of expiredItems) {
      await db.sequelize.transaction(async (t: Transaction) => {
        const product = await Product.findByPk(item.productId, {
          transaction: t,
          lock: true,
        });

        if (product) {
          product.stock += item.quantity;
          await product.save({ transaction: t });
        }

        await item.destroy({ transaction: t });
      });
    }
  }

  async getCartItemById(itemId: string): Promise<CartItem | null> {
    return CartItem.findByPk(itemId, {
      include: [
        {
          model: Cart,
          as: "cart",
          attributes: ["userId"],
        },
      ],
    });
  }
}
