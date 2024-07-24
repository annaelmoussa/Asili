<script setup lang="ts">
import { watch, onMounted, ref } from 'vue'
import Toast from 'primevue/toast'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import StickyHeader from '@/components/StickyHeader.vue'
import RGPDModal from '@/components/RGPDModal.vue'
import { useNotificationStore } from '@/stores/notification'
import { useToast } from 'primevue/usetoast'
import { rgpdApi } from '@/api/config'
import useRGPDStore from './stores/rgpd'

const notificationStore = useNotificationStore()
const rgpdStore = useRGPDStore()
const toast = useToast()
const isRGPDLoaded = ref(false)

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

onMounted(() => {
  loadRGPDModules()
})

async function loadRGPDModules() {
  try {
    const response = await rgpdApi.getAllRGPDModules()
    rgpdStore.setModules(response.data)
    isRGPDLoaded.value = true
  } catch (error) {
    console.error('Error fetching RGPD modules:', error)
    notificationStore.showNotification('Failed to load RGPD modules', 'error')
    rgpdStore.setModules([])
    isRGPDLoaded.value = true
  }
}
</script>

<template>
  <Toast />
  <LanguageSwitcher />
  <div v-if="!$route.meta.hideNavbar">
    <StickyHeader />
  </div>
  <RGPDModal v-if="isRGPDLoaded" />
  <router-view />
</template>

<style>
/* Add any global styles here */
</style>
