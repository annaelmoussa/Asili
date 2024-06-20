import { defineStore } from 'pinia';
import type {IProduct} from "@/api";

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cartItems') || '[]'),
  }),
  getters: {
    totalItems(state) {
      // TODO Lotfi : any to ICart
      return state.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    }
  },
  actions: {
    // TODO Lotfi : any to ICart
    addToCart(product: any) {
      const existingItem = this.items.find((item: IProduct) => item.id === product.id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.items.push({ ...product, quantity: 1 });
      }
      this.saveCart();
    },
    removeFromCart(productId: string) {
      this.items = this.items.filter((item: IProduct) => item.id !== productId);
      this.saveCart();
    },
    increment(productId: string) {
      const item = this.items.find((item: IProduct) => item.id === productId);
      if (item) {
        item.quantity++;
      }
      this.saveCart();
    },
    decrement(productId: string) {
      const item = this.items.find((item: IProduct) => item.id === productId);
      if (item && item.quantity > 1) {
        item.quantity--;
      } else {
        this.removeFromCart(productId);
      }
      this.saveCart();
    },
    saveCart() {
      localStorage.setItem('cartItems', JSON.stringify(this.items));
    }
  }
});
