<template>
  <div class="crud-panel">
    <h1 class="text-2xl font-bold mb-6">{{ title }}</h1>

    <button
      @click="openModal()"
      class="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      {{ addButtonText }}
    </button>

    <AdvancedTable
      :data="items"
      :columns="columns"
      :itemsPerPage="10"
      @view="viewItem"
      @edit="editItem"
      @delete="confirmDeleteItem"
      @delete-selected="confirmDeleteSelectedItems"
    />

    <teleport to="body">
      <div
        v-if="isModalVisible"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg p-8 max-w-2xl w-full">
          <h2 class="text-2xl font-bold mb-4">
            {{ isEditing ? `Modifier ${itemName}` : `Ajouter ${itemName}` }}
          </h2>
          <slot
            name="form"
            :form-data="formData"
            :errors="errors"
            :is-submitting="isSubmitting"
            :update-field="updateField"
          ></slot>
          <div class="flex justify-end space-x-2 mt-4">
            <button
              @click="closeModal"
              class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Annuler
            </button>
            <button
              @click="submit"
              :disabled="isSubmitting"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {{ isEditing ? 'Mettre à jour' : 'Ajouter' }}
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <teleport to="body">
      <div
        v-if="isViewModalVisible"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg p-8 max-w-2xl w-full">
          <h2 class="text-2xl font-bold mb-4">Détails de {{ itemName }}</h2>
          <slot name="view" :item="currentViewItem"></slot>
          <button
            @click="closeViewModal"
            class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Fermer
          </button>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, type PropType } from 'vue'
import AdvancedTable from './AdvancedTable.vue'
import { useForm } from '@/composables/useForm'
import { z } from 'zod'
import type { TableColumn } from '@/types/table'

interface TableItem {
  id: string | number
  [key: string]: any
}



export default defineComponent({
  name: 'CrudPanel',
  components: { AdvancedTable },
  props: {
    title: String,
    itemName: String,
    addButtonText: String,
    items: Array as PropType<TableItem[]>,
    columns: Array as PropType<TableColumn[]>,
    formSchema: Object as PropType<z.ZodObject<any>>,
    initialFormData: Object,
    formTransformations: Object,
    apiActions: {
      type: Object as PropType<{
        fetchItems: () => Promise<void>
        createItem: (data: any) => Promise<void>
        updateItem: (id: string, data: any) => Promise<void>
        deleteItem: (id: string) => Promise<void>
      }>,
      required: true
    }
  },
  setup(props) {
    const isModalVisible = ref(false)
    const isViewModalVisible = ref(false)
    const isEditing = ref(false)
    const currentViewItem = ref<TableItem | null>(null)

    const {
      formData,
      errors,
      isSubmitting,
      updateField,
      submit,
      cancelSubmit // Changez ceci de 'cancel' à 'cancelSubmit'
    } = useForm(
      props.initialFormData,
      props.formTransformations || {},
      props.formSchema || z.object({}), // Utilisez un objet Zod vide si formSchema n'est pas fourni
      async (data: any) => {
        if (isEditing.value) {
          await props.apiActions.updateItem(data.id, data)
        } else {
          await props.apiActions.createItem(data)
        }
        await props.apiActions.fetchItems()
        closeModal()
      }
    )

    const resetForm = () => {
      cancelSubmit()
    }

    const openModal = (item?: any) => {
      if (item) {
        isEditing.value = true
        Object.assign(formData, item)
      } else {
        isEditing.value = false
        resetForm()
      }
      isModalVisible.value = true
    }

    const closeModal = () => {
      isModalVisible.value = false
      resetForm()
    }

    const viewItem = (item: any) => {
      currentViewItem.value = item
      isViewModalVisible.value = true
    }

    const closeViewModal = () => {
      isViewModalVisible.value = false
      currentViewItem.value = null
    }

    const editItem = (item: any) => {
      openModal(item)
    }

    const confirmDeleteItem = async (item: any) => {
      if (confirm(`Êtes-vous sûr de vouloir supprimer cet élément ?`)) {
        await props.apiActions.deleteItem(item.id)
        await props.apiActions.fetchItems()
      }
    }

    const confirmDeleteSelectedItems = async (selectedIds: string[]) => {
      if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedIds.length} éléments ?`)) {
        await Promise.all(selectedIds.map((id) => props.apiActions.deleteItem(id)))
        await props.apiActions.fetchItems()
      }
    }

    return {
      isModalVisible,
      isViewModalVisible,
      isEditing,
      currentViewItem,
      formData,
      errors,
      isSubmitting,
      updateField,
      submit,
      openModal,
      closeModal,
      viewItem,
      closeViewModal,
      editItem,
      confirmDeleteItem,
      confirmDeleteSelectedItems,
      resetForm
    }
  }
})
</script>
