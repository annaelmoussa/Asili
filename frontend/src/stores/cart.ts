import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cartItems') || '[]'),
  }),
  getters: {
    totalItems(state) {
      return state.items.reduce((sum, item) => sum + item.quantity, 0);
    }
  },
  actions: {
    addToCart(product) {
      const existingItem = this.items.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.items.push({ ...product, quantity: 1 });
      }
      this.saveCart();
    },
    removeFromCart(productId) {
      this.items = this.items.filter(item => item.id !== productId);
      this.saveCart();
    },
    increment(productId) {
      const item = this.items.find(item => item.id === productId);
      if (item) {
        item.quantity++;
      }
      this.saveCart();
    },
    decrement(productId) {
      const item = this.items.find(item => item.id === productId);
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
