<template>
  <div
    v-if="!allModulesAccepted"
    class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
  >
    <div class="bg-white p-8 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      <h2 class="text-3xl font-bold mb-6 text-gray-800">Consentement RGPD</h2>
      <div v-for="module in modules" :key="module.id" class="mb-6 border-b border-gray-200 pb-4">
        <h3 class="text-xl font-semibold mb-3 text-gray-700">{{ module.name }}</h3>
        <div v-html="module.content" class="mb-4 text-gray-600 leading-relaxed"></div>
        <div v-if="module.requiresAcceptance" class="flex items-center">
          <input
            :id="module.id"
            type="checkbox"
            v-model="acceptedModules[module.id]"
            class="mr-3 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label :for="module.id" class="text-gray-700 font-medium">J'accepte</label>
        </div>
      </div>
      <button
        @click="acceptAll"
        class="w-full font-bold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out mt-6"
        :class="[
          canAccept
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        ]"
        :disabled="!canAccept"
      >
        Tout accepter et continuer
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
  }
}

onMounted(() => {
  rgpdStore.loadAcceptedModules()
  modules.value.forEach((module: IRGPDModule) => {
    acceptedModules.value[module.id] = rgpdStore.acceptedModules.includes(module.id)
  })
})
</script>
