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

interface ChartData {
  [key: string]: any
}

const props = defineProps({
  data: { type: Array as () => ChartData[], required: true },
  index: { type: String, required: true },
  categories: { type: Array as () => string[], required: true },
  colors: { type: Array as () => string[], required: true },
  keyElement: { type: String, required: true }
})

const isDataReady = computed(() => {
  return props.data && props.data.length > 0 && props.categories && props.categories.length > 0
})
</script>
