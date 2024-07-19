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
import { defineComponent, ref, onMounted } from 'vue'
import { z } from 'zod'
import { defaultApi } from '@/api/config'
import type { IProduct, ICategory, IBrand, ProductCreationParams } from '@/api'
import CrudPanel from '@/components/CrudPanel.vue'
import type { TableColumn } from '@/types/table'
import ProductForm from '@/components/ProductForm.vue'
import ProductDetails from '@/components/ProductDetails.vue'
import { extractImageUrl, formatPrice, parsePrice } from '@/utils/productUtils'

interface TableItem {
  id: string | number
  [key: string]: any
}

export default defineComponent({
  name: 'PanelProduct',
  components: { CrudPanel, ProductForm, ProductDetails },
  setup() {
    const products = ref<TableItem[]>([])
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
      isPromotion: z.boolean(),
      lowStockThreshold: z.number().int().min(0, 'Le seuil de stock bas doit être positif')
    })

    const initialData: ProductCreationParams = {
      name: '',
      description: '',
      price: 0,
      categoryId: '',
      brandId: '',
      stock: 0,
      image: '',
      isPromotion: false,
      lowStockThreshold: 10 // Provide a default value
    }

    const transformations = {
      price: (value: string) => parseFloat(value),
      stock: (value: string) => parseInt(value),
      lowStockThreshold: (value: string) => parseInt(value)
    }

    function cleanProductData(
      data: Partial<ProductCreationParams>
    ): Partial<ProductCreationParams> {
      const cleanedData: Partial<ProductCreationParams> = {
        name: data.name,
        description: data.description,
        price: data.price,
        categoryId: data.categoryId,
        brandId: data.brandId,
        stock: data.stock,
        image: data.image,
        isPromotion: data.isPromotion,
        lowStockThreshold: data.lowStockThreshold
      }

      // Filtrer les propriétés undefined
      return Object.fromEntries(
        Object.entries(cleanedData).filter(([_, v]) => v !== undefined)
      ) as Partial<ProductCreationParams>
    }

    const apiActions = {
      fetchItems: async () => {
        const response = await defaultApi.getProducts()
        products.value = response.data.map((product) => ({
          ...product,
          id: product.id || '',
          image: extractImageUrl(product.image),
          price: parsePrice(product.price),
          categoryName: product.category?.name ?? '',
          brandName: product.brand?.name ?? ''
        }))
      },
      createItem: async (data: ProductCreationParams): Promise<void> => {
        const cleanedData = cleanProductData(data)
        await defaultApi.createProduct(cleanedData)
      },
      updateItem: async (id: string, data: Partial<ProductCreationParams>): Promise<void> => {
        const cleanedData = cleanProductData(data)
        await defaultApi.updateProduct(id, cleanedData)
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
})
</script>
