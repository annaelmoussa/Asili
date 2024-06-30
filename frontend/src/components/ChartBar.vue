<template>
    <BarChart :data="data" :index="index" :categories="categories" :colors="colors" :key="keyElement" />
  </template>
  
  <script setup>
  import { BarChart } from '@/components/ui/chart-bar';
  import { defineProps } from 'vue';
  
  const props = defineProps({
    data: Array,
    index: String,
    categories: Array,
    colors: Array,
    keyElement: String
  });
  </script>
  