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
import { defineComponent, ref, onMounted } from 'vue'
import { z } from 'zod'
import { defaultApi } from '@/api/config'
import type { ICategory } from '@/api'
import CrudPanel from '@/components/CrudPanel.vue'
import type { TableColumn } from '@/types/table'
import CategoryForm from '@/components/CategoryForm.vue'
import CategoryDetails from '@/components/CategoryDetails.vue'

interface TableItem {
  id: string | number
  [key: string]: any
}

export default defineComponent({
  name: 'PanelCategories',
  components: { CrudPanel, CategoryForm, CategoryDetails },
  setup() {
    const categories = ref<TableItem[]>([])

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
        categories.value = response.data.map((category) => ({
          ...category,
          id: category.id || ''
        }))
      },
      createItem: async (data: { name: string }): Promise<void> => {
        await defaultApi.createCategory({ name: data.name })
      },
      updateItem: async (id: string, data: { name: string }): Promise<void> => {
        await defaultApi.updateCategory(id, { name: data.name })
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
})
</script>
