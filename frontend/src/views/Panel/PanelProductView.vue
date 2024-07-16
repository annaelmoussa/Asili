<template>
  <CrudPanel
    title="Gestion des produits"
    itemName="produit"
    addButtonText="Ajouter un produit"
    :items="products"
    :columns="columns"
    :formSchema="productSchema"
    :initialFormData="initialData"
    :formTransformations="transformations"
    :apiActions="apiActions"
  >
    <template #form="{ formData, errors, updateField }">
      <ProductForm
        :form-data="formData"
        :errors="errors"
        :categories="categories"
        :brands="brands"
        @update-field="updateField"
      />
    </template>
    <template #view="{ item }">
      <ProductDetails :product="item" />
    </template>
  </CrudPanel>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import { z } from 'zod'
import { defaultApi } from '@/api/config'
import type { IProduct, ICategory, IBrand, PartialIProduct } from '@/api'
import CrudPanel from '@/components/CrudPanel.vue'
import type { TableColumn } from '@/types/table'
import ProductForm from '@/components/ProductForm.vue'
import ProductDetails from '@/components/ProductDetails.vue'
import { extractImageUrl, formatPrice, parsePrice } from '@/utils/productUtils'

export default {
  name: 'PanelProduct',
  components: { CrudPanel, ProductForm, ProductDetails },
  setup() {
    const products = ref<IProduct[]>([])
    const categories = ref<ICategory[]>([])
    const brands = ref<IBrand[]>([])

    const columns: TableColumn[] = [
      { key: 'image', label: 'Image', sortable: false, type: 'image' },
      { key: 'name', label: 'Nom', sortable: true, type: 'text' },
      { key: 'price', label: 'Prix', sortable: true, type: 'text' },
      { key: 'stock', label: 'Stock', sortable: true, type: 'text' },
      { key: 'category.name', label: 'Catégorie', sortable: true, type: 'text' },
      { key: 'brand.name', label: 'Marque', sortable: true, type: 'text' },
      { key: 'isPromotion', label: 'Promotion', sortable: true, type: 'boolean' }
    ]

    const productSchema = z.object({
      name: z.string().min(1, 'Le nom est requis'),
      description: z.string().min(1, 'La description est requise'),
      price: z.number().min(0, 'Le prix doit être positif'),
      categoryId: z.string().min(1, 'La catégorie est requise'),
      brandId: z.string().min(1, 'La marque est requise'),
      stock: z.number().int().min(0, 'Le stock doit être positif'),
      image: z.string().url("L'URL de l'image est invalide").optional(),
      isPromotion: z.boolean()
    })

    const initialData = {
      name: '',
      description: '',
      price: 0,
      categoryId: '',
      brandId: '',
      stock: 0,
      image: '',
      isPromotion: false
    }

    const transformations = {
      price: (value: string) => parseFloat(value),
      stock: (value: string) => parseInt(value)
    }

    const apiActions = {
      fetchItems: async () => {
        const response = await defaultApi.getProducts()
        products.value = response.data.map((product) => ({
          ...product,
          image: extractImageUrl(product.image),
          price: parsePrice(product.price),
          'category.name': product.category?.name ?? '',
          'brand.name': product.brand?.name ?? ''
        }))
      },
      createItem: async (data: PartialIProduct): Promise<void> => {
        await defaultApi.createProduct(data)
      },
      updateItem: async (id: string, data: PartialIProduct): Promise<void> => {
        // Filtrer les champs pour n'inclure que ceux nécessaires
        const updateData: PartialIProduct = {
          id,
          name: data.name,
          description: data.description,
          price: data.price,
          categoryId: data.categoryId,
          brandId: data.brandId,
          stock: data.stock,
          image: data.image,
          isPromotion: data.isPromotion
        }
        await defaultApi.updateProduct(id, updateData)
      },
      deleteItem: async (id: string): Promise<void> => {
        await defaultApi.deleteProduct(id)
      }
    }

    onMounted(async () => {
      await apiActions.fetchItems()
      await fetchCategoriesAndBrands()
    })

    const fetchCategoriesAndBrands = async () => {
      try {
        const [categoriesResponse, brandsResponse] = await Promise.all([
          defaultApi.getCategories_2(),
          defaultApi.getBrands_1()
        ])
        categories.value = categoriesResponse.data
        brands.value = brandsResponse.data
      } catch (error) {
        console.error('Error fetching categories and brands:', error)
      }
    }

    return {
      products,
      categories,
      brands,
      columns,
      productSchema,
      initialData,
      transformations,
      apiActions
    }
  }
}
</script>
