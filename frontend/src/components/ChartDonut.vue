<template>
  <DonutChart :data="data" :index="index" :category="category" :colors="colors" :key="keyElement" />
</template>

<script setup>
import { DonutChart } from '@/components/ui/chart-donut'
import { defineProps } from 'vue'

const props = defineProps({
  data: Array,
  index: String,
  category: String,
  colors: Array,
  keyElement: String
})
</script>
