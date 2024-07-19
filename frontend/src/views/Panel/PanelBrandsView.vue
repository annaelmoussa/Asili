<template>
  <CrudPanel
    title="Gestion des marques"
    itemName="marque"
    addButtonText="Ajouter une marque"
    :items="brands"
    :columns="columns"
    :formSchema="brandSchema"
    :initialFormData="initialData"
    :formTransformations="transformations"
    :apiActions="apiActions"
  >
    <template #form="{ formData, errors, updateField }">
      <BrandForm :form-data="formData" :errors="errors" @update-field="updateField" />
    </template>
    <template #view="{ item }">
      <BrandDetails :brand="item" />
    </template>
  </CrudPanel>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { z } from 'zod'
import { defaultApi } from '@/api/config'
import type { IBrand } from '@/api'
import CrudPanel from '@/components/CrudPanel.vue'
import type { TableColumn } from '@/types/table'
import BrandForm from '@/components/BrandForm.vue'
import BrandDetails from '@/components/BrandDetails.vue'

interface TableItem {
  id: string | number
  [key: string]: any
}

export default defineComponent({
  name: 'PanelBrands',
  components: { CrudPanel, BrandForm, BrandDetails },
  setup() {
    const brands = ref<TableItem[]>([])

    const columns: TableColumn[] = [
      { key: 'id', label: 'ID', sortable: true, type: 'text' },
      { key: 'name', label: 'Nom', sortable: true, type: 'text' }
    ]

    const brandSchema = z.object({
      name: z.string().min(1, 'Le nom est requis')
    })

    const initialData = {
      name: ''
    }

    const transformations = {}

    const apiActions = {
      fetchItems: async () => {
        const response = await defaultApi.getBrands_1()
        brands.value = response.data.map((brand) => ({
          ...brand,
          id: brand.id || ''
        }))
      },
      createItem: async (data: { name: string }): Promise<void> => {
        await defaultApi.createBrand({ name: data.name })
      },
      updateItem: async (id: string, data: { name: string }): Promise<void> => {
        await defaultApi.updateBrand(id, { name: data.name })
      },
      deleteItem: async (id: string): Promise<void> => {
        await defaultApi.deleteBrand(id)
      }
    }

    onMounted(async () => {
      await apiActions.fetchItems()
    })

    return {
      brands,
      columns,
      brandSchema,
      initialData,
      transformations,
      apiActions
    }
  }
})
</script>
