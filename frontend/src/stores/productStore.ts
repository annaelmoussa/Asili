import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { defaultApi } from '@/api/config'
import type {
  IProduct,
  UpdateLowStockThresholdRequest
} from '@/api'

// Define ProductCreationParams type
interface ProductCreationParams {
  name: string;
  description: string;
  price: string;
  categoryId: string;
  brandId: string;
  stock: string;
  isPromotion: string;
  lowStockThreshold: string;
  image?: File;
}

// Define ProductUpdateParams type
interface ProductUpdateParams {
  name?: string;
  description?: string;
  price?: string;
  categoryId?: string;
  brandId?: string;
  stock?: string;
  isPromotion?: string;
  lowStockThreshold?: string;
  image?: File;
  existingImageUrl?: string;
}

export const useProductStore = defineStore('product', () => {
  const products = ref<IProduct[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const getProductById = computed(() => {
    return (id: string) => products.value.find((product) => product.id === id)
  })

  const fetchProducts = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await defaultApi.getProducts()
      products.value = response.data
    } catch (err) {
      error.value = 'Failed to fetch products'
      console.error('Error fetching products:', err)
    } finally {
      isLoading.value = false
    }
  }

  const createProduct = async (productData: ProductCreationParams) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await defaultApi.createProduct(
        productData.name,
        productData.description,
        productData.price,
        productData.categoryId,
        productData.brandId,
        productData.stock,
        productData.isPromotion,
        productData.lowStockThreshold,
        productData.image
      )
      products.value.push(response.data)
    } catch (err) {
      error.value = 'Failed to create product'
      console.error('Error creating product:', err)
    } finally {
      isLoading.value = false
    }
  }

  const updateProduct = async (productId: string, updates: ProductUpdateParams) => {
    try {
      const response = await defaultApi.updateProduct(
        productId,
        updates.name,
        updates.description,
        updates.price,
        updates.categoryId,
        updates.brandId,
        updates.stock,
        updates.isPromotion,
        updates.lowStockThreshold,
        updates.image,
        updates.existingImageUrl
      )
      const index = products.value.findIndex((p) => p.id === productId)
      if (index !== -1) {
        products.value[index] = response.data
      }
      return response.data
    } catch (error) {
      console.error('Failed to update product:', error)
      throw error
    }
  }

  const updateLowStockThreshold = async (productId: string, newThreshold: number) => {
    try {
      const request: UpdateLowStockThresholdRequest = {
        lowStockThreshold: newThreshold
      }
      const response = await defaultApi.updateLowStockThreshold(productId, request)
      const index = products.value.findIndex((p) => p.id === productId)
      if (index !== -1) {
        products.value[index] = response.data
      }
      return response.data
    } catch (error) {
      console.error('Failed to update low stock threshold:', error)
      throw error
    }
  }

  const deleteProduct = async (id: string) => {
    isLoading.value = true
    error.value = null
    try {
      await defaultApi.deleteProduct(id)
      products.value = products.value.filter((product) => product.id !== id)
    } catch (err) {
      error.value = 'Failed to delete product'
      console.error('Error deleting product:', err)
    } finally {
      isLoading.value = false
    }
  }

  const updateStock = async (productId: string, quantity: number) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await defaultApi.updateProduct(
        productId,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        quantity.toString() // Convert number to string
      )
      const index = products.value.findIndex((p) => p.id === productId)
      if (index !== -1) {
        products.value[index] = response.data
      }
    } catch (err) {
      error.value = 'Failed to update stock'
      console.error('Error updating stock:', err)
    } finally {
      isLoading.value = false
    }
  }

  const getLowStockProducts = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await defaultApi.getLowStockProducts()
      return response.data
    } catch (err) {
      error.value = 'Failed to fetch low stock products'
      console.error('Error fetching low stock products:', err)
      return []
    } finally {
      isLoading.value = false
    }
  }

  const getStockHistory = async (productId: string) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await defaultApi.getStockHistory(productId)
      return response.data
    } catch (err) {
      error.value = 'Failed to fetch stock history'
      console.error('Error fetching stock history:', err)
      return []
    } finally {
      isLoading.value = false
    }
  }

  return {
    products,
    isLoading,
    error,
    getProductById,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    getLowStockProducts,
    getStockHistory,
    updateLowStockThreshold
  }
})