<template>
  <div class="products-container">
    <h1 class="title">{{ $t('app.products.title') }}</h1>
    <div v-if="isLoading" class="loading">{{ $t('app.products.loading') }}</div>
    <div v-else>
      <div v-if="products && products.length" class="products-grid">
        <ProductItem v-for="product in products" :key="product.id" :product="product" />
      </div>
      <div v-else class="no-products">{{ $t('app.products.noProducts') }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { defaultApi } from '@/api/config'
import ProductItem from './ProductItem.vue'
import type { IProduct } from '@/api'

const products = ref<IProduct[]>([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    const response = await defaultApi.getProducts()
    console.log('Fetched products:', response.data)
    products.value = response.data
  } catch (error) {
    console.error('Failed to fetch products:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.products-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

.title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 40px;
  font-size: 2.5em;
  font-weight: bold;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.loading {
  text-align: center;
  font-size: 1.2em;
  color: #7f8c8d;
}

.no-products {
  text-align: center;
  font-size: 1.2em;
  color: #e74c3c;
}
</style>
