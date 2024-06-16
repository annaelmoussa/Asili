<template>
  <div v-if="isLoading" class="loading">{{ $t('app.ProductSingleView.loading') }}</div>
  <div v-else-if="product">
    <div class="product-details-container">
      <img :src="product.image" alt="Image du produit" class="product-image-detail"/>
      <div class="product-details">
        <h1 class="product-title">{{ product.name }}</h1>
        <span class="product-stock" :class="{'in-stock': product.stock > 0, 'out-of-stock': product.stock <= 0}">
          {{ product.stock > 0 ? $t('app.products.inStock') : $t('app.products.outOfStock') }}
        </span>
        <h2 class="product-category">{{ product.category }}</h2>
        <p class="product-description-detail">{{ product.description }}</p>
        <div class="price-stock-container">
          <span class="product-price-detail">{{ formattedPrice }}</span>
        </div>
        <button @click="addToCart" class="add-to-cart-detail" :disabled="product.stock <= 0">
          <i class="pi pi-shopping-cart"></i>
          {{ $t('app.products.addToCart') }}
        </button>
      </div>
    </div>
  </div>
  <div v-else class="no-product">{{ $t('app.ProductSingleView.noProduct') }}</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCurrencyStore } from '@/stores/currency'
import { defaultApi } from '@/api/config'
import type { IProduct } from '@/api'

const route = useRoute()
const router = useRouter()
const product = ref<IProduct | null>(null)
const isLoading = ref(true)
const currencyStore = useCurrencyStore()

const formattedPrice = computed(() => {
  return currencyStore.formattedPrice(product.value?.price)
})

onMounted(async () => {
  try {
    const productId = route.params.productId as string
    const response = await defaultApi.getProduct(productId)
    product.value = response.data
  } catch (error) {
    console.error('Failed to fetch product details:', error)
  } finally {
    isLoading.value = false
  }
})

const addToCart = () => {
  console.log('Add to cart', product.value)
}
</script>

<style scoped>
.product-details-container {
  display: flex;
  flex-direction: row;
  align-items: start;
  gap: 20px;
  padding: 20px;
  background: #fff;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.product-image-detail {
  width: 300px;
  height: 300px;
  object-fit: cover;
  border-radius: 5px;
}

.product-details {
  flex: 1;
  text-align: left;
}

.product-title {
  font-size: 2em;
  color: #2c3e50;
  font-weight: bold;
}

.product-category {
  font-size: 1.2em;
  color: #16a085;
  margin-bottom: 5px;
}

.product-description-detail {
  font-size: 1em;
  color: #7f8c8d;
  margin: 10px 0;
}

.price-stock-container {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin: 10px 0;
}

.product-price-detail {
  font-size: 1.5em;
  color: #10b981;
  font-weight: bold;
}

.product-stock {
  font-size: 1em;
  padding: 5px 10px;
  border-radius: 5px;
}

.in-stock {
  color: #27ae60;
  background-color: #ecf9f1;
}

.out-of-stock {
  color: #c0392b;
  background-color: #fef6f6;
}

.add-to-cart-detail {
  padding: 10px 20px;
  background-color: #ffffff;
  border: 2px solid #10b981;
  border-radius: 5px;
  color: #10b981;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  font-size: 1em;
  display: inline-flex;
  align-items: center;
}

.add-to-cart-detail:hover {
  background-color: #10b981;
  color: #ffffff;
}

.add-to-cart-detail:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading, .no-product {
  text-align: center;
  font-size: 1.2em;
  color: #7f8c8d;
}
</style>
