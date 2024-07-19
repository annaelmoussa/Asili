<template>
  <div class="space-y-4">
    <p><strong>ID:</strong> {{ category.id }}</p>
    <p><strong>Nom:</strong> {{ category.name }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { ICategory } from '@/api'

export default defineComponent({
  name: 'CategoryDetails',
  props: {
    category: {
      type: Object as PropType<ICategory>,
      required: true
    }
  }
})
</script>
