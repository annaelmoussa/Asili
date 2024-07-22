import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { IRGPDModule } from '@/api'

const useRGPDStore = defineStore('rgpd', () => {
  const modules = ref<IRGPDModule[]>([])
  const acceptedModules = ref<string[]>([])

  const allModulesAccepted = computed(() => {
    const requiredModules = modules.value.filter((module) => module.requiresAcceptance)
    return requiredModules.every((module) => acceptedModules.value.includes(module.id))
  })

  function setModules(newModules: IRGPDModule[]) {
    modules.value = newModules
  }

  function acceptModule(moduleId: string) {
    if (!acceptedModules.value.includes(moduleId)) {
      acceptedModules.value.push(moduleId)
      saveAcceptedModules()
    }
  }

  function acceptAllModules() {
    acceptedModules.value = modules.value.map((module) => module.id)
    saveAcceptedModules()
  }

  function saveAcceptedModules() {
    localStorage.setItem('acceptedRGPDModules', JSON.stringify(acceptedModules.value))
  }

  function loadAcceptedModules() {
    const storedModules = localStorage.getItem('acceptedRGPDModules')
    if (storedModules) {
      acceptedModules.value = JSON.parse(storedModules)
    }
  }

  return {
    modules,
    acceptedModules,
    allModulesAccepted,
    setModules,
    acceptModule,
    acceptAllModules,
    loadAcceptedModules
  }
})

export default useRGPDStore
