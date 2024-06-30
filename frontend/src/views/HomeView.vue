<template>
  <div>
    <main class="main-content">
      <HomeBanner />
      <ProductsGrid />
    </main>
  </div>
</template>

<script setup>
import HomeBanner from '@/components/HomeBanner.vue'
import ProductsGrid from '@/components/ProductsGrid.vue'
</script>

<style scoped>
.main-content {
  padding-top: 20px;
}
</style>
