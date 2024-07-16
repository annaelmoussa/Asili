<template>
  <CrudPanel
    title="Gestion des catégories"
    itemName="catégorie"
    addButtonText="Ajouter une catégorie"
    :items="categories"
    :columns="columns"
    :formSchema="categorySchema"
    :initialFormData="initialData"
    :formTransformations="transformations"
    :apiActions="apiActions"
  >
    <template #form="{ formData, errors, updateField }">
      <CategoryForm :form-data="formData" :errors="errors" @update-field="updateField" />
    </template>
    <template #view="{ item }">
      <CategoryDetails :category="item" />
    </template>
  </CrudPanel>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import { z } from 'zod'
import { defaultApi } from '@/api/config'
import type { ICategory, PartialICategory } from '@/api'
import CrudPanel from '@/components/CrudPanel.vue'
import type { TableColumn } from '@/types/table'
import CategoryForm from '@/components/CategoryForm.vue'
import CategoryDetails from '@/components/CategoryDetails.vue'

export default {
  name: 'PanelCategories',
  components: { CrudPanel, CategoryForm, CategoryDetails },
  setup() {
    const categories = ref<ICategory[]>([])

    const columns: TableColumn[] = [
      { key: 'id', label: 'ID', sortable: true, type: 'text' },
      { key: 'name', label: 'Nom', sortable: true, type: 'text' }
    ]

    const categorySchema = z.object({
      name: z.string().min(1, 'Le nom est requis')
    })

    const initialData = {
      name: ''
    }

    const transformations = {}

    const apiActions = {
      fetchItems: async () => {
        const response = await defaultApi.getCategories_2()
        categories.value = response.data
      },
      createItem: async (data: PartialICategory): Promise<void> => {
        await defaultApi.createCategory(data)
      },
      updateItem: async (id: string, data: PartialICategory): Promise<void> => {
        // Assurez-vous que seuls id et name sont envoyés
        const updateData: PartialICategory = {
          id,
          name: data.name
        }
        await defaultApi.updateCategory(id, updateData)
      },
      deleteItem: async (id: string): Promise<void> => {
        await defaultApi.deleteCategory(id)
      }
    }

    onMounted(async () => {
      await apiActions.fetchItems()
    })

    return {
      categories,
      columns,
      categorySchema,
      initialData,
      transformations,
      apiActions
    }
  }
}
</script>
