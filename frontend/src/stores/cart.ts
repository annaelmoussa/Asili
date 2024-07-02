import { defineStore } from 'pinia';
import { useUserStore } from './user';
import { defaultApi } from '@/api/config';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
  }),
  getters: {
    totalItems(state) {
      return state.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    totalPrice: (state) => {
      return state.items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
    },
  },
  actions: {
    async init() {
      const userStore = useUserStore();
      if (userStore.isAuthenticated) {
        await this.fetchCart();
      } else {
        this.loadLocalCart();
      }
    },
    async clearCart() {
      localStorage.removeItem('cart');
      this.items = [];
      const userStore = useUserStore();
      if (userStore.isAuthenticated) {
        await this.fetchCart();
      } else {
        this.loadLocalCart();
      }
    },
    async fetchCart() {
      const userStore = useUserStore();
      if (userStore.isAuthenticated) {
        try {
          const response = await defaultApi.getCartItems(userStore.user.id);
          this.items = response.data;
        } catch (error) {
          console.error('Failed to fetch cart:', error);
        }
      } else {
        this.loadLocalCart();
      }
    },
    loadLocalCart() {
      const localItems = localStorage.getItem('cart');
      if (localItems) {
        this.items = JSON.parse(localItems);
      }
    },
    async addToCart(product) {
      const userStore = useUserStore();
      if (userStore.isAuthenticated) {
        const existingItem = this.items.find(item => item.productId === product.id);
        if (existingItem) {
          existingItem.quantity++;
          await this.increment(product.id);
        } else {
          await defaultApi.addItem(userStore.user.id, { productId: product.id, quantity: 1 });
          await this.fetchCart();
        }
      } else {
        const existingItem = this.items.find(item => item.product && item.product.id === product.id);
        if (existingItem) {
          existingItem.quantity++;
        } else {
          this.items.push({
            id: product.id,
            product: {
              id: product.id,
              name: product.name,
              description: product.description,
              price: product.price,
              category: product.category,
              stock: product.stock,
              image: product.image
            },
            quantity: 1
          });
        }
        this.saveCart();
      }
    },
    async removeFromCart(itemId) {
      const userStore = useUserStore();
      if (userStore.isAuthenticated) {
        await defaultApi.removeItem(itemId);
        await this.fetchCart();
      } else {
        this.items = this.items.filter(item => item.id != itemId);
        this.saveCart();
      }
    },
    async increment(productId) {
      const item = this.items.find(item => item.product.id == productId);
      console.log(productId, item, this.items);
      if (!item)
          return;

      const userStore = useUserStore();
      if (userStore.isAuthenticated) {
        const newQuantity = item.quantity + 1;
        await defaultApi.updateItemQuantity(productId, newQuantity);
        await this.fetchCart();
      } else {
        item.quantity++;
        this.saveCart();
      }
    },
    async decrement(productId) {
      const item = this.items.find(item => item.product.id == productId);
      if (!item)
        return;

      const userStore = useUserStore();
      if (userStore.isAuthenticated) {
        const newQuantity = item.quantity - 1;
        await defaultApi.updateItemQuantity(productId, newQuantity);
        await this.fetchCart();
      } else if (item && item.quantity > 1) {
        item.quantity--;
        this.saveCart();
      } else {
        this.removeFromCart(item.id);
      }
    },
    saveCart() {
      if (!useUserStore().isAuthenticated) {
        localStorage.setItem('cart', JSON.stringify(this.items));
      }
    }
  }
});
