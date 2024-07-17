// src/stores/cart.ts

import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { defaultApi } from '@/api/config'
import type { IProduct, ICartItem } from '@/api'
import type { CartItem } from '@/types/cart'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[]
  }),
  getters: {
    totalItems(): number {
      return this.items.reduce((sum, item) => sum + item.quantity, 0)
    }
  },
  actions: {
    async init() {
      const userStore = useUserStore()
      if (userStore.isAuthenticated) {
        await this.fetchCart()
      } else {
        this.loadLocalCart()
      }
    },
    async clearCart() {
      localStorage.removeItem('cart')
      this.items = []
      const userStore = useUserStore()
      if (userStore.isAuthenticated) {
        await this.fetchCart()
      } else {
        this.loadLocalCart()
      }
    },
    async fetchCart() {
      const userStore = useUserStore()
      if (userStore.isAuthenticated && userStore.user?.id) {
        try {
          const response = await defaultApi.getCartItems(userStore.user.id)
          this.items = response.data as CartItem[]
        } catch (error) {
          console.error('Failed to fetch cart:', error)
        }
      } else {
        this.loadLocalCart()
      }
    },
    loadLocalCart() {
      const localItems = localStorage.getItem('cart')
      if (localItems) {
        this.items = JSON.parse(localItems)
      }
    },
    async addToCart(product: IProduct) {
      const userStore = useUserStore()
      if (userStore.isAuthenticated && userStore.user?.id) {
        const existingItem = this.items.find((item) => item.product.id === product.id)
        if (existingItem) {
          existingItem.quantity++
          await this.increment(product.id)
        } else {
          await defaultApi.addItem(userStore.user.id, { productId: product.id, quantity: 1 })
          await this.fetchCart()
        }
      } else {
        const existingItem = this.items.find((item) => item.product.id === product.id)
        if (existingItem) {
          existingItem.quantity++
        } else {
          const newItem: Partial<CartItem> = {
            id: product.id,
            productId: product.id,
            product: product,
            quantity: 1,
            reservationExpires: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          this.items.push(newItem as CartItem)
        }
        this.saveCart()
      }
    },

    async removeFromCart(itemId: string) {
      const userStore = useUserStore()
      if (userStore.isAuthenticated) {
        await defaultApi.removeItem(itemId)
        await this.fetchCart()
      } else {
        this.items = this.items.filter((item) => item.id !== itemId)
        this.saveCart()
      }
    },
    async increment(itemId: string) {
      const item = this.items.find((item) => item.id === itemId)
      if (!item) return

      const userStore = useUserStore()
      if (userStore.isAuthenticated) {
        const newQuantity = item.quantity + 1
        try {
          await defaultApi.updateItemQuantity(itemId, newQuantity)
          await this.fetchCart()
        } catch (error) {
          console.error('Failed to increment item quantity:', error)
        }
      } else {
        item.quantity++
        this.saveCart()
      }
    },

    async decrement(itemId: string) {
      const item = this.items.find((item) => item.id === itemId)
      if (!item) return

      const userStore = useUserStore()
      if (userStore.isAuthenticated) {
        const newQuantity = item.quantity - 1
        if (newQuantity > 0) {
          try {
            await defaultApi.updateItemQuantity(itemId, newQuantity)
            await this.fetchCart()
          } catch (error) {
            console.error('Failed to decrement item quantity:', error)
          }
        } else {
          await this.removeFromCart(itemId)
        }
      } else if (item.quantity > 1) {
        item.quantity--
        this.saveCart()
      } else {
        this.removeFromCart(itemId)
      }
    },
    saveCart() {
      if (!useUserStore().isAuthenticated) {
        localStorage.setItem('cart', JSON.stringify(this.items))
      }
    }
  }
})
