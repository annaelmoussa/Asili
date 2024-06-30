<template>
  <AreaChart :data="data" :index="index" :categories="categories" :colors="colors" :key="keyElement" />
</template>

<script setup>
import { AreaChart } from '@/components/ui/chart-area'
import { defineProps } from 'vue'

const props = defineProps({
  data: Array,
  index: String,
  categories: Array,
  colors: Array,
  keyElement: String
})
</script>
