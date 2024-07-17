<template>
  <div class="sticky-header" v-if="!isChangePasswordPage">
    <AppHeader />
    <AppNavbar />
  </div>
</template>

<script setup>
import AppHeader from '@/components/AppHeader.vue'
import AppNavbar from '@/components/AppNavbar.vue'
import { useRoute } from 'vue-router';
import { computed } from 'vue';
const route = useRoute();
const isChangePasswordPage = computed(() => route.path === '/change-password');

</script>

<style scoped>
.sticky-header {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sticky-header > * {
  margin-bottom: 10px;
}
</style>
