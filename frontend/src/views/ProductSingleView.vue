<template>
  <div>
    <LanguageSwitcher />
    <StickyHeader />
    <main class="main-content">
      <ProductSingle />
    </main>
  </div>
</template>

<script setup>
import StickyHeader from '@/components/StickyHeader.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import ProductSingle from "@/components/ProductSingle.vue";
</script>

<style scoped>
.main-content {
  padding-top: 20px;
}
</style>
