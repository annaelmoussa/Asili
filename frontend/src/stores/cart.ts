import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { defaultApi } from '@/api/config'
import type { IProduct, ICartItem } from '@/api'

interface CartItem {
  id: string
  productId: string
  product: IProduct
  quantity: number
  reservationExpires: string | null
  createdAt: string
  updatedAt: string
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
          const response = await defaultApi.getCartItems()
          this.items = response.data.map((item: ICartItem) => ({
            id: item.id || item.productId,
            productId: item.productId,
            product: item.product as IProduct,
            quantity: item.quantity,
            reservationExpires: item.reservationExpires || null,
            createdAt: item.createdAt || new Date().toISOString(),
            updatedAt: item.updatedAt || new Date().toISOString()
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
          await this.increment(existingItem.id)
        } else {
          await defaultApi.addItem({ productId: product.id, quantity: 1 })
          await this.fetchCart()
        }
      } else {
        const existingItem = this.items.find((item) => item.product.id === product.id)
        if (existingItem) {
          existingItem.quantity++
        } else {
          const newItem: CartItem = {
            id: product.id,
            productId: product.id,
            product: product,
            quantity: 1,
            reservationExpires: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          this.items.push(newItem)
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
        console.log(item, item.quantity)
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
