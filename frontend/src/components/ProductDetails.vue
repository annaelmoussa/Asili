<template>
  <div class="space-y-4">
    <img :src="product.image" :alt="product.name" class="w-full h-64 object-cover mb-4" />
    <p><strong>Nom:</strong> {{ product.name }}</p>
    <p><strong>Description:</strong> {{ product.description }}</p>
    <p><strong>Prix:</strong> {{ formatPrice(product.price) }}</p>
    <p><strong>Catégorie:</strong> {{ product.category?.name }}</p>
    <p><strong>Marque:</strong> {{ product.brand?.name }}</p>
    <p><strong>Stock:</strong> {{ product.stock }}</p>
    <p><strong>En promotion:</strong> {{ product.isPromotion ? 'Oui' : 'Non' }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { IProduct } from '@/api'
import { formatPrice } from '@/utils/productUtils'

export default defineComponent({
  name: 'ProductDetails',
  props: {
    product: {
      type: Object as PropType<IProduct>,
      required: true
    }
  },
  setup() {
    return {
      formatPrice
    }
  }
})
</script>
