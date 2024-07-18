<template>
  <LanguageSwitcher />
  <div v-if="!$route.meta.hideNavbar">
    <StickyHeader />
  </div>
  <router-view />
</template>

<script setup lang="ts">
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import StickyHeader from '@/components/StickyHeader.vue'
</script>

<style scoped>

</style>
