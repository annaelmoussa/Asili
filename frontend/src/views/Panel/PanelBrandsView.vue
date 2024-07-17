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
import { ref, onMounted } from 'vue'
import { z } from 'zod'
import { defaultApi } from '@/api/config'
import type { IBrand, PartialIBrand } from '@/api'
import CrudPanel from '@/components/CrudPanel.vue'
import type { TableColumn } from '@/types/table'
import BrandForm from '@/components/BrandForm.vue'
import BrandDetails from '@/components/BrandDetails.vue'

export default {
  name: 'PanelBrands',
  components: { CrudPanel, BrandForm, BrandDetails },
  setup() {
    const brands = ref<IBrand[]>([])

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
        brands.value = response.data
      },
      createItem: async (data: PartialIBrand): Promise<void> => {
        await defaultApi.createBrand(data)
      },
      updateItem: async (id: string, data: PartialIBrand): Promise<void> => {
        // Assurez-vous que seuls id et name sont envoyés
        const updateData: PartialIBrand = {
          id,
          name: data.name
        }
        await defaultApi.updateBrand(id, updateData)
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
}
</script>
