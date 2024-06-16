<template>
  <div v-if="product" class="product-card" @click="goToProductSingleView(product.id)">
    <img v-if="product.image" :src="product.image" alt="Product image" class="product-image" />
    <div v-else class="no-image">{{ $t('app.products.noImage') }}</div>
    <div class="product-info">
      <h2 class="product-name">{{ product.name }}</h2>
      <p class="product-description">{{ product.description }}</p>
    </div>
    <span class="product-price">{{ formattedPrice }}</span>
    <button @click="addToCart" class="add-to-cart">
      <i class="pi pi-shopping-cart"></i>
      {{ $t('app.products.addToCart') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'
import { useCurrencyStore } from '@/stores/currency'
import { useRouter } from 'vue-router'
import type { IProduct } from '@/api'

const router = useRouter()

const props = defineProps<{ product: IProduct }>()
const currencyStore = useCurrencyStore()

const formattedPrice = computed(() => {
  return currencyStore.formattedPrice(props.product.price)
})

const addToCart = () => {
  console.log('Add to cart', props.product)
}

function goToProductSingleView(productId) {
  router.push({ name: 'ProductSingleView', params: { productId } })
}
</script>

<style scoped>
.product-card {
  background: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 300px; /* Adjust the width as needed */
  margin-bottom: 20px; /* Add some spacing between cards */
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.product-image {
  width: 100%;
  height: 200px; /* Set a fixed height for uniform image size */
  object-fit: contain; /* Ensure the image fits within the bounds */
  border-radius: 10px;
  margin-bottom: 15px;
}

.product-info {
  margin-bottom: 15px;
}

.product-name {
  font-size: 1.2em;
  color: #2c3e50;
  font-weight: bold;
  margin: 0;
}

.product-description {
  font-size: 0.9em;
  color: #7f8c8d;
  margin: 0;
}

.product-price {
  font-size: 1.4em;
  color: #10b981;
  font-weight: bold;
  margin: 15px 0;
}

.add-to-cart {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: #ffffff;
  color: #10b981;
  border: 2px solid #10b981;
  padding: 10px 0;
  border-radius: 5px;
  cursor: pointer;
  transition:
    background-color 0.3s,
    color 0.3s;
  font-size: 1em;
}

.add-to-cart i {
  margin-right: 5px;
}

.add-to-cart:hover {
  background-color: #10b981;
  color: #ffffff;
}

.no-image {
  font-size: 0.9em;
  color: #7f8c8d;
  margin-bottom: 15px;
}
</style>
