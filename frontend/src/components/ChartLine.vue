<template>
  <LineChart
    :data="data"
    :index="index"
    :categories="categories"
    :colors="colors"
    :key="keyElement"
  />
</template>

<script setup>
import { LineChart } from '@/components/ui/chart-line'
import { defineProps } from 'vue'

const props = defineProps({
  data: Array,
  index: String,
  categories: Array,
  colors: Array,
  keyElement: String
})
</script>
