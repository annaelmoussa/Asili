<template>
  <div>
    <main class="main-content">
      <HomeBanner />
      <ProductsGrid />
      <Newsletter />
    </main>
  </div>
</template>

<script setup>
import HomeBanner from '@/components/HomeBanner.vue'
import ProductsGrid from '@/components/ProductsGrid.vue'
import Newsletter from '@/components/Newsletter.vue'
</script>

<style scoped>
.main-content {
  padding-top: 20px;
}
</style>
