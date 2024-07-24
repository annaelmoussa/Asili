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
import type { IProduct, ICategory, IBrand } from '@/api'
import CrudPanel from '@/components/CrudPanel.vue'
import type { TableColumn } from '@/types/table'
import ProductForm from '@/components/ProductForm.vue'
import ProductDetails from '@/components/ProductDetails.vue'
import { extractImageUrl, formatPrice, parsePrice } from '@/utils/productUtils'

interface TableItem {
  id: string
  [key: string]: any
}

const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().min(1, 'La description est requise'),
  price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
    message: 'Le prix doit être un nombre positif'
  }),
  categoryId: z.string().min(1, 'La catégorie est requise'),
  brandId: z.string().min(1, 'La marque est requise'),
  stock: z.number().min(0, 'Le stock doit être positif'),
  image: z.union([z.instanceof(File), z.string()]).optional(),
  isPromotion: z.boolean(),
  lowStockThreshold: z.number().min(0, 'Le seuil de stock bas doit être positif')
})

type ProductFormData = z.infer<typeof productSchema>

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
      { key: 'categoryName', label: 'Catégorie', sortable: true, type: 'text' },
      { key: 'brandName', label: 'Marque', sortable: true, type: 'text' },
      { key: 'isPromotion', label: 'Promotion', sortable: true, type: 'boolean' }
    ]

    const initialData: ProductFormData = {
      name: '',
      description: '',
      price: '0',
      categoryId: '',
      brandId: '',
      stock: 0,
      isPromotion: false,
      lowStockThreshold: 10
    }

    const transformations = {
      price: (value: string) => value, // Keep as string
      stock: (value: string) => parseInt(value, 10),
      lowStockThreshold: (value: string) => parseInt(value, 10),
      isPromotion: (value: string) => value === 'true'
    }

    const apiActions = {
      fetchItems: async () => {
        const response = await defaultApi.getProducts()
        products.value = response.data.map((product) => ({
          ...product,
          id: product.id || '',
          image: extractImageUrl(product.image),
          price: formatPrice(product.price), // Format price for display
          categoryName: product.category?.name ?? '',
          brandName: product.brand?.name ?? ''
        }))
      },
      createItem: async (data: ProductFormData): Promise<void> => {
        try {
          console.log('Creating product with data:', data)
          const formData = new FormData()
          Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined) {
              if (key === 'image' && value instanceof File) {
                formData.append(key, value, value.name)
              } else {
                formData.append(key, value.toString())
              }
            }
          })

          await defaultApi.createProduct(
            formData.get('name') as string,
            formData.get('description') as string,
            formData.get('price') as string,
            formData.get('categoryId') as string,
            formData.get('brandId') as string,
            formData.get('stock') as string,
            formData.get('isPromotion') as string,
            formData.get('lowStockThreshold') as string,
            formData.get('image') as File | undefined
          )
        } catch (error) {
          console.error('Error creating product:', error)
          throw error
        }
      },
      updateItem: async (id: string, data: Partial<ProductFormData>): Promise<void> => {
        try {
          console.log('Updating product with data:', data)
          const formData = new FormData()
          Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined) {
              if (key === 'image') {
                if (value instanceof File) {
                  formData.append(key, value, value.name)
                } else {
                  formData.append('existingImageUrl', value as string)
                }
              } else {
                formData.append(key, value.toString())
              }
            }
          })

          await defaultApi.updateProduct(
            id,
            formData.get('name') as string | undefined,
            formData.get('description') as string | undefined,
            formData.get('price') as string | undefined,
            formData.get('categoryId') as string | undefined,
            formData.get('brandId') as string | undefined,
            formData.get('stock') as string | undefined,
            formData.get('isPromotion') as string | undefined,
            formData.get('lowStockThreshold') as string | undefined,
            formData.get('image') as File | undefined,
            formData.get('existingImageUrl') as string | undefined
          )
        } catch (error) {
          console.error('Error updating product:', error)
          throw error
        }
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
