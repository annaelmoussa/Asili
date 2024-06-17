<template>
  <div>
    <LanguageSwitcher />
    <StickyHeader />
    <main class="main-content">
      <Cart />
    </main>
  </div>
</template>

<script setup>
import StickyHeader from '@/components/StickyHeader.vue'
import Cart from '@/components/Cart.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
</script>

<style scoped>
.main-content {
  padding-top: 20px;
}
</style>
