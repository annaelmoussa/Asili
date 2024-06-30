<template>
  <LanguageSwitcher />
  <StickyHeader />
  <router-view />
</template>

<script setup lang="ts">
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import StickyHeader from '@/components/StickyHeader.vue'
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f1f2f6;
}
</style>
