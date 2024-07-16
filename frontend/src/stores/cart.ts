// src/stores/cart.ts

import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { defaultApi } from '@/api/config'
import type { IProduct, ICartItem } from '@/api'

interface CartItem {
  id: string
  product: IProduct
  quantity: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[]
  }),

  getters: {
    totalItems(): number {
      return this.items.reduce((sum, item) => sum + item.quantity, 0)
    },
    totalPrice(): number {
      return this.items.reduce((sum, item) => sum + item.quantity * item.product.price, 0)
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
          this.items = response.data.map((item: ICartItem) => ({
            id: item.id || item.productId,
            product: item.product as IProduct,
            quantity: item.quantity
          }))
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
          this.items.push({
            id: product.id,
            product: product,
            quantity: 1
          })
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

    async increment(productId: string) {
      const item = this.items.find((item) => item.product.id === productId)
      if (!item) return

      const userStore = useUserStore()
      if (userStore.isAuthenticated && item.id) {
        const newQuantity = item.quantity + 1
        await defaultApi.updateItemQuantity(item.id, newQuantity)
        await this.fetchCart()
      } else {
        item.quantity++
        this.saveCart()
      }
    },

    async decrement(productId: string) {
      const item = this.items.find((item) => item.product.id === productId)
      if (!item) return

      const userStore = useUserStore()
      if (userStore.isAuthenticated && item.id) {
        const newQuantity = item.quantity - 1
        if (newQuantity > 0) {
          await defaultApi.updateItemQuantity(item.id, newQuantity)
          await this.fetchCart()
        } else {
          await this.removeFromCart(item.id)
        }
      } else if (item.quantity > 1) {
        item.quantity--
        this.saveCart()
      } else {
        this.removeFromCart(item.id)
      }
    },

    saveCart() {
      if (!useUserStore().isAuthenticated) {
        localStorage.setItem('cart', JSON.stringify(this.items))
      }
    }
  }
})
