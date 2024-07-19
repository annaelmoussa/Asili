<template>
  <LineChart
    v-if="isDataReady"
    :data="data"
    :index="index"
    :categories="categories"
    :colors="colors"
    :key="keyElement"
  />
</template>

<script setup lang="ts">
import { LineChart } from '@/components/ui/chart-line'
import { defineProps, computed } from 'vue'

const props = defineProps({
  data: { type: Array, required: true },
  index: { type: String, required: true },
  categories: { type: Array, required: true },
  colors: { type: Array, required: true },
  keyElement: { type: String, required: true }
})

const isDataReady = computed(() => {
  return props.data && props.data.length > 0 && props.categories && props.categories.length > 0
})
</script>