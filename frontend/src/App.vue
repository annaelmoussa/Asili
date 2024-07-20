<template>
  <Toast />
  <LanguageSwitcher />
  <StickyHeader />
  <router-view />
</template>

<script setup lang="ts">
import { watch } from 'vue'
import Toast from 'primevue/toast'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import StickyHeader from '@/components/StickyHeader.vue'
import { useNotificationStore } from '@/stores/notification'
import { useToast } from 'primevue/usetoast'

const notificationStore = useNotificationStore()
const toast = useToast()

watch(
  () => notificationStore.visible,
  (newValue) => {
    if (newValue) {
      toast.add({
        severity: notificationStore.type,
        summary: notificationStore.type.charAt(0).toUpperCase() + notificationStore.type.slice(1),
        detail: notificationStore.message,
        life: 3000
      })
      notificationStore.hideNotification()
    }
  }
)
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f1f2f6;
}
</style>
