<template>
  <div class="space-y-4">
    <p><strong>ID:</strong> {{ brand.id }}</p>
    <p><strong>Nom:</strong> {{ brand.name }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { IBrand } from '@/api'

export default defineComponent({
  name: 'BrandDetails',
  props: {
    brand: {
      type: Object as PropType<IBrand>,
      required: true
    }
  }
})
</script>
