<template>
  <div>
    <LanguageSwitcher />
    <StickyHeader />
    <main class="main-content">
      <HomeBanner />
      <ProductsGrid />
    </main>
  </div>
</template>

<script setup>
import StickyHeader from '@/components/StickyHeader.vue'
import HomeBanner from '@/components/HomeBanner.vue'
import ProductsGrid from '@/components/ProductsGrid.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
</script>

<style scoped>
.main-content {
  padding-top: 20px;
}
</style>
