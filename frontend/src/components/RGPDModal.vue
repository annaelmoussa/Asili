<template>
  <div
    v-if="!allModulesAccepted"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <h2 class="text-2xl font-bold mb-4">RGPD Consent</h2>
      <div v-for="module in modules" :key="module.id" class="mb-4">
        <h3 class="text-lg font-semibold mb-2">{{ module.name }}</h3>
        <div v-html="module.content" class="mb-2"></div>
        <div v-if="module.requiresAcceptance" class="flex items-center">
          <input
            :id="module.id"
            type="checkbox"
            v-model="acceptedModules[module.id]"
            class="mr-2"
          />
          <label :for="module.id">I accept</label>
        </div>
      </div>
      <button
        @click="acceptAll"
        class="font-bold py-2 px-4 rounded mt-4"
        :class="[
          canAccept
            ? 'bg-blue-500 hover:bg-blue-600 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        ]"
        :disabled="!canAccept"
      >
        Accept All and Continue
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import useRGPDStore from '@/stores/rgpd'
import { storeToRefs } from 'pinia'
import type { IRGPDModule } from '@/api'

const rgpdStore = useRGPDStore()
const { modules, allModulesAccepted } = storeToRefs(rgpdStore)

const acceptedModules = ref<Record<string, boolean>>({})

const canAccept = computed(() => {
  return modules.value.every(
    (module: IRGPDModule) => !module.requiresAcceptance || acceptedModules.value[module.id]
  )
})

const acceptAll = () => {
  if (canAccept.value) {
    rgpdStore.acceptAllModules()
    // Vous pouvez ajouter ici une logique pour fermer la modal ou rediriger l'utilisateur
  }
}

onMounted(() => {
  rgpdStore.loadAcceptedModules()
  modules.value.forEach((module: IRGPDModule) => {
    acceptedModules.value[module.id] = rgpdStore.acceptedModules.includes(module.id)
  })
})
</script>
