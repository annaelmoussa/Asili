<script setup lang="ts">
import { Configuration, DefaultApi, type IProduct } from '@/api'
import { onMounted, ref } from 'vue'

const api = new DefaultApi(new Configuration({ basePath: 'http://localhost:3000' }))
const products = ref<IProduct[] | null>(null)
const isLoading = ref(true)

onMounted(async () => {
  try {
    const response = await api.getProducts()
    products.value = response.data.length ? response.data : []
  } catch (error) {
    console.error('Failed to fetch products:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="products-container">
    <h1 class="title">Our Products</h1>
    <div v-if="isLoading" class="loading">Loading...</div>
    <div v-else>
      <div v-if="products && products.length" class="products-grid">
        <div v-for="product in products" :key="product.id" class="product-card">
          <h2 class="product-name">{{ product.name }}</h2>
          <p class="product-description">{{ product.description }}</p>
          <p class="product-price">Price: ${{ product.price }}</p>
          <p class="product-category">Category: {{ product.category }}</p>
          <p class="product-stock">In stock: {{ product.stock }}</p>
        </div>
      </div>
      <div v-else class="no-products">No products found</div>
    </div>
  </div>
</template>

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
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.product-card {
  background: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-name {
  font-size: 1.2em;
  margin-bottom: 10px;
  color: #2c3e50;
}

.product-description {
  font-size: 1em;
  margin-bottom: 10px;
  color: #7f8c8d;
}

.product-price,
.product-category,
.product-stock {
  font-size: 0.9em;
  color: #95a5a6;
  margin-bottom: 5px;
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
