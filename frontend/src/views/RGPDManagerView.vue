<template>
  <div class="rgpd-manager bg-gray-100 min-h-screen p-8">
    <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">RGPD Modules</h2>

      <!-- Liste des modules -->
      <div v-if="modules.length" class="space-y-4 mb-8">
        <div
          v-for="module in modules"
          :key="module.id"
          class="bg-gray-50 p-4 rounded-md shadow-sm flex justify-between items-center"
        >
          <div>
            <h3 class="font-semibold text-gray-700">{{ module.name }}</h3>
            <p class="text-sm text-gray-500">Type: {{ module.type }}</p>
          </div>
          <div>
            <button
              @click="editModule(module)"
              class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md mr-2 transition duration-200"
            >
              Edit
            </button>
            <button
              @click="deleteModule(module.id)"
              class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition duration-200"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <p v-else class="text-gray-500 italic">No RGPD modules found.</p>

      <!-- Formulaire pour créer/éditer un module -->
      <form @submit.prevent="saveModule" class="space-y-4 bg-gray-50 p-6 rounded-lg mb-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Module Name</label>
          <input
            id="name"
            v-model="currentModule.name"
            placeholder="Module Name"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label for="content" class="block text-sm font-medium text-gray-700 mb-1"
            >Module Content</label
          >
          <textarea
            id="content"
            v-model="currentModule.content"
            placeholder="Module Content"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
          ></textarea>
        </div>
        <div>
          <label for="type" class="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            id="type"
            v-model="currentModule.type"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="popup">Popup</option>
            <option value="text_block">Text Block</option>
          </select>
        </div>
        <div class="flex items-center">
          <input
            id="requires-acceptance"
            type="checkbox"
            v-model="currentModule.requiresAcceptance"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="requires-acceptance" class="ml-2 block text-sm text-gray-700"
            >Requires Acceptance</label
          >
        </div>
        <button
          type="submit"
          class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-200"
        >
          {{ isEditing ? 'Update' : 'Create' }} Module
        </button>
      </form>

      <!-- Bouton d'export -->
      <button
        @click="exportModules"
        class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition duration-200"
      >
        Export Modules
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import type {
  IRGPDModule,
  PickIRGPDModuleExcludeKeyofIRGPDModuleIdOrCreatedAtOrUpdatedAt
} from '@/api'
import { rgpdApi } from '@/api/config';

export default defineComponent({
  name: 'RGPDManager',
  setup() {
    const modules = ref<IRGPDModule[]>([])
    const currentModule = ref<PickIRGPDModuleExcludeKeyofIRGPDModuleIdOrCreatedAtOrUpdatedAt>({
      name: '',
      content: '',
      type: 'popup',
      requiresAcceptance: false
    })
    const isEditing = ref(false)
    const editingId = ref<string | null>(null)

    

    const fetchModules = async () => {
      try {
        const response = await rgpdApi.getAllRGPDModules()
        modules.value = response.data
      } catch (error) {
        console.error('Error fetching modules:', error)
      }
    }

    const saveModule = async () => {
      try {
        if (isEditing.value && editingId.value) {
          await rgpdApi.updateRGPDModule(editingId.value, currentModule.value)
        } else {
          await rgpdApi.createRGPDModule(currentModule.value)
        }
        await fetchModules()
        resetForm()
      } catch (error) {
        console.error('Error saving module:', error)
      }
    }

    const editModule = (module: IRGPDModule) => {
      currentModule.value = {
        name: module.name,
        content: module.content,
        type: module.type,
        requiresAcceptance: module.requiresAcceptance
      }
      isEditing.value = true
      editingId.value = module.id
    }

    const deleteModule = async (id: string) => {
      if (confirm('Are you sure you want to delete this module?')) {
        try {
          await rgpdApi.deleteRGPDModule(id)
          await fetchModules()
        } catch (error) {
          console.error('Error deleting module:', error)
        }
      }
    }

    const exportModules = async () => {
      try {
        const response = await rgpdApi.exportRGPDModules()
        console.log('Exported modules:', response.data)
        // Implement download logic here
      } catch (error) {
        console.error('Error exporting modules:', error)
      }
    }

    const resetForm = () => {
      currentModule.value = {
        name: '',
        content: '',
        type: 'popup',
        requiresAcceptance: false
      }
      isEditing.value = false
      editingId.value = null
    }

    onMounted(fetchModules)

    return {
      modules,
      currentModule,
      isEditing,
      saveModule,
      editModule,
      deleteModule,
      exportModules
    }
  }
})
</script>
