import Cart from "../models/Cart";
import { ICart } from "../interfaces/ICart";
import CartItem from "../models/CartItem";
import { ICartItem } from "../interfaces/ICartItem";
import Product from "../models/Product";

export type CartItemCreationParams = Pick<ICartItem, "productId" | "cartId" | "quantity">;

export class CartService {
    async getCartIdByUserId(userId: string): Promise<string | null> {
        const cart = await Cart.findOne({
            where: { userId },
            attributes: ['id']
        });
        return cart ? cart.id : null;
    }

    async getCartItems(cartId: string): Promise<ICartItem[]> {
        const items = await CartItem.findAll({
            where: { cartId },
            include: [{
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'description', 'price', 'category', 'stock', 'image']  // Spécifiez les attributs que vous souhaitez inclure
            }],
            attributes: ['id', 'quantity'],
        });
        return items;
    }

    async updateCart(userId: string, items: { productId: string; quantity: number; }[]): Promise<void> {
        const cart = await Cart.findOne({
            where: { userId }
        });

        if (!cart) {
            throw new Error("Cart not found");
        }

        await Promise.all(items.map(async item => {
            const cartItem = await CartItem.findOne({
                where: {
                    cartId: cart.id,
                    productId: item.productId
                }
            });

            if (cartItem) {
                cartItem.quantity = item.quantity;
                await cartItem.save();
            } else {
                await CartItem.create({
                    cartId: cart.id,
                    productId: item.productId,
                    quantity: item.quantity
                });
            }
        }));
    }


    async addItem(userId: string, productId: string, quantity: number): Promise<ICartItem> {
        const [cart, created] = await Cart.findOrCreate({
            where: { userId }
        });

        const [item, itemCreated] = await CartItem.findOrCreate({
            where: { cartId: cart.id, productId },
            defaults: {
                cartId: cart.id,
                productId: productId,
                quantity: quantity
            } as CartItemCreationParams
        });

        if (!itemCreated) {
            item.quantity += quantity;
            await item.save();
        }

        return item;
    }

    async removeItem(itemId: string): Promise<void> {
        const result = await CartItem.destroy({
            where: { productId: itemId }
        });
        // TODO Lotfi : voir si utile de supprimer le panier si plus d'article.
        if (result === 0) {
            throw new Error("Item not found or already removed");
        }
    }

    async updateItemQuantity(itemId: string, quantity: number): Promise<ICartItem> {
        const item = await CartItem.findOne({
            where: { productId: itemId }
        });

        if (!item) {
            throw new Error("Item not found");
        }

        item.quantity = quantity;
        await item.save();
        return item;
    }
}