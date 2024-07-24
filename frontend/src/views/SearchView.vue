<template>
  <section>
    <div class="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <header>
        <h2 class="text-xl font-bold text-gray-900 sm:text-3xl">Nos produits</h2>
  
        <p class="mt-4  text-gray-500">
          Explorez notre sélection de protéines et compléments alimentaires de haute qualité, spécialement formulés pour soutenir votre santé et vos performances. Atteignez vos objectifs avec nos produits fiables et efficaces.
        </p>
      </header>
  
      <div class="mt-8 block lg:hidden">
        <button
          class="flex cursor-pointer items-center gap-2 border-b border-gray-400 pb-1 text-gray-900 transition hover:border-gray-600"
        >
          <span class="text-sm font-medium"> Filters & Sorting </span>
  
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-4 rtl:rotate-180"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
  
      <div class="mt-4 lg:mt-8 lg:grid lg:grid-cols-4 lg:items-start lg:gap-8">
        <div class="hidden space-y-4 lg:block">
          <div>
            <p class="block text-xs font-medium text-gray-700">Filtre</p>
            <Label for="globalSearch">Recherche Globale</Label>
            <Input v-model="searchQuery" @input="updateSearch" placeholder="Rechercher un produit" />
            <div class="mt-1 space-y-2">
              <details
                class="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary
                  class="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition"
                >
                  <span class="text-sm font-medium"> Disponibilité </span>
  
                  <span class="transition group-open:-rotate-180">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="h-4 w-4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </span>
                </summary>
  
                <div class="border-t border-gray-200 bg-white">
                  <ul class="space-y-1 border-t border-gray-200 p-4">
                    <li>
                      <label for="FilterInStock" class="inline-flex items-center gap-2">
                        <input
                          v-model="inStock" 
                          @change="updateSearch"
                          type="checkbox"
                          id="inStock"
                          class="size-5 rounded border-gray-300"
                        />
                        <span class="text-sm font-medium text-gray-700"> En stock </span>
                      </label>
                    </li>                    
                  </ul>
                </div>
              </details>
              <details
                class="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary
                  class="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition"
                >
                  <span class="text-sm font-medium"> Promotion </span>
  
                  <span class="transition group-open:-rotate-180">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="h-4 w-4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </span>
                </summary>
  
                <div class="border-t border-gray-200 bg-white">
                  <ul class="space-y-1 border-t border-gray-200 p-4">
                    <li>
                      <label for="FilterInStock" class="inline-flex items-center gap-2">
                        <input
                          v-model="isPromotion" @change="updateSearch"
                          type="checkbox"
                          id="inStock"
                          class="size-5 rounded border-gray-300"
                        />
                        <span class="text-sm font-medium text-gray-700"> En promotion </span>
                      </label>
                    </li>                    
                  </ul>
                </div>
              </details>
              <details
                class="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary
                  class="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition"
                >
                  <span class="text-sm font-medium"> Marques </span>
  
                  <span class="transition group-open:-rotate-180">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="h-4 w-4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </span>
                </summary>
  
                <div class="border-t border-gray-200 bg-white">
                  <ul class="space-y-1 border-t border-gray-200 p-4">
                    <li>
                      <label for="FilterInStock" class="inline-flex items-center gap-2">
                        <Select v-model="selectedBrand" @update:modelValue="updateSearch">
          <SelectTrigger class="w-[180px]">
            <SelectValue placeholder="Sélectionnez une marque" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem :value="null">Toutes les marques</SelectItem>
            <SelectItem v-for="brand in brands" :key="brand" :value="brand">
              {{ brand }}
            </SelectItem>
          </SelectContent>
        </Select>
                        
                      </label>
                    </li>                    
                  </ul>
                </div>
              </details>
              <details
                class="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary
                  class="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition"
                >
                  <span class="text-sm font-medium"> Categories </span>
  
                  <span class="transition group-open:-rotate-180">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="h-4 w-4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </span>
                </summary>
  
                <div class="border-t border-gray-200 bg-white">
                  <ul class="space-y-1 border-t border-gray-200 p-4">
                    <li>
                      <label for="FilterInStock" class="inline-flex items-center gap-2">
                        <Select v-model="selectedCategory" @update:modelValue="updateSearch">
                          <SelectTrigger class="w-[180px]">
                            <SelectValue placeholder="Sélectionnez une catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem :value="null">Toutes les catégories</SelectItem>
                            <SelectItem v-for="category in categories" :key="category.id" :value="category">
                              {{ category.name }}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </label>
                    </li>                    
                  </ul>
                </div>
              </details>
  
              <details
                class="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary
                  class="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition"
                >
                  <span class="text-sm font-medium"> Price </span>
  
                  <span class="transition group-open:-rotate-180">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="h-4 w-4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </span>
                </summary>
  
                <div class="border-t border-gray-200 bg-white">
                  <div class="border-t border-gray-200 p-4">
                    <div class="flex justify-between gap-4">
                      <label for="FilterPriceFrom" class="flex items-center gap-2">
                        <span class="text-sm text-gray-600">$</span>
  
                        <Input
                          v-model.number="minPrice" @input="updateSearch" type="number" placeholder="Min"
                          id="FilterPriceFrom"
                          class="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                        />
                      </label>
  
                      <label for="FilterPriceTo" class="flex items-center gap-2">
                        <span class="text-sm text-gray-600">$</span>
  
                        <Input
                          v-model.number="maxPrice" @input="updateSearch" type="number" placeholder="Max"
                          id="FilterPriceTo"
                          class="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </details>
  
              
            </div>
          </div>
        </div>
  
        <div class="lg:col-span-3">
          <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <li v-for="product in products" :key="product.id" @click="goToProductPage(product.id)">
              <a href="#" class="group block">
    <img
      :src="extractImageUrl(product.image)" :alt="product.name"
      class="h-[200px] w-full object-cover sm:h-[350px]"
    />
  
    <div class="mt-3 flex justify-between text-sm">
      <div>
        <h3 class="text-gray-900 group-hover:underline group-hover:underline-offset-4">
          {{ product.name }}
        </h3>
  
        <p class="mt-1.5 text-pretty text-xs text-gray-500">
          {{ product.description }}
        </p>
      </div>
  
      <p class="text-gray-900">{{ product.price.toFixed(2) }}€</p>
    </div>
  </a>
            </li>
            
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { defaultApi } from '@/api/config'
import type { IBrand, ICategory, IProduct } from '@/api'
import { extractImageUrl } from '@/utils/productUtils'
import { useToast } from '@/components/ui/toast/use-toast'
import { Toaster } from '@/components/ui/toast'
import { useI18n } from 'vue-i18n'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

const { t } = useI18n()
const { toast } = useToast()

const route = useRoute()
const router = useRouter()

const searchQuery = ref('')
const selectedCategory = ref<{ id: string; name: string } | null>(null)
const selectedBrand = ref('')
const minPrice = ref<number | null>(null)
const maxPrice = ref<number | null>(null)
const isPromotion = ref<boolean>(false)
const inStock = ref<boolean>(false)
const isCategorySubscribed = ref(false)
const products = ref<IProduct[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const categories = ref<ICategory[]>([])
const brands = ref<string[]>([])

function initializeFilters() {
  const {
    query,
    category,
    brand,
    minPrice: minPriceParam,
    maxPrice: maxPriceParam,
    isPromotion: isPromotionParam,
    inStock: inStockParam
  } = route.query

  searchQuery.value = (query as string) || ''
  selectedCategory.value = category ? categories.value.find(c => c.name === category) as { id: string; name: string } || null : null
  selectedBrand.value = (brand as string) || ''
  minPrice.value = minPriceParam ? Number(minPriceParam) : null
  maxPrice.value = maxPriceParam ? Number(maxPriceParam) : null
  isPromotion.value = isPromotionParam === 'true'
  inStock.value = inStockParam === 'true'
}

onMounted(() => {
  initializeFilters()
  loadCategoriesAndBrands()
  performSearch()
})

// Watch for route changes
watch(
  () => route.query,
  () => {
    initializeFilters()
    performSearch()
  },
  { deep: true }
)

async function loadCategoriesAndBrands() {
  try {
    const categoriesResponse = await defaultApi.getCategoriesWithId()
    categories.value = categoriesResponse.data.map(category => ({
      id: category.id,
      name: category.name
    }))
    console.log(JSON.stringify(categoriesResponse),"porto")

    const brandsResponse = await defaultApi.getBrands()
    brands.value = brandsResponse.data
  } catch (err) {
    console.error('Erreur lors du chargement des catégories et des marques:', err)
    error.value = 'Une erreur est survenue lors du chargement des filtres.'
  }
}

async function performSearch() {
  loading.value = true
  error.value = null

  try {
    const response = await defaultApi.searchProducts(
      searchQuery.value,
      selectedCategory.value?.name,
      selectedBrand.value,
      minPrice.value?.toString() ?? undefined,
      maxPrice.value?.toString() ?? undefined,
      isPromotion.value.toString(),
      inStock.value?.toString()
    )
    products.value = response.data
  } catch (err) {
    console.error('Erreur lors de la recherche:', err)
    error.value = 'Une erreur est survenue lors de la recherche.'
  } finally {
    loading.value = false
  }
}

async function updateSearch() {
  const query: Record<string, string | undefined> = {
    query: searchQuery.value || undefined,
    category: selectedCategory.value?.name || undefined,
    brand: selectedBrand.value || undefined,
    minPrice: minPrice.value?.toString() || undefined,
    maxPrice: maxPrice.value?.toString() || undefined,
    isPromotion: isPromotion.value ? 'true' : undefined,
    inStock: inStock.value ? 'true' : undefined
  }
  if (selectedCategory.value) {
    await checkCategorySubscription()
  } else {
    isCategorySubscribed.value = false
  }
  // Remove undefined values
  Object.keys(query).forEach((key) => query[key] === undefined && delete query[key])

  router.push({ name: 'search', query })
}

function goToProductPage(productId: string) {
  router.push({ name: 'ProductSingleView', params: { productId } })
}

async function checkCategorySubscription() {
  if (selectedCategory.value) {
    try {
      const response = await defaultApi.checkCategoryNewProductsSubscription(selectedCategory.value.id)
      isCategorySubscribed.value = response.data.isSubscribed
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'abonnement à la catégorie:', error)
    }
  } else {
    isCategorySubscribed.value = false
  }
}

async function toggleCategorySubscription() {
  if (!selectedCategory.value) return

  try {
    if (isCategorySubscribed.value) {
      await defaultApi.unsubscribeFromCategoryNewProducts(selectedCategory.value.id)
      isCategorySubscribed.value = false
      toast({
        title: t('app.categories.unsubscribeSuccess'),
        description: t('app.categories.unsubscribeMessage', { category: selectedCategory.value.name }),
        duration: 3000,
      })
    } else {
      await defaultApi.subscribeToCategoryNewProducts(selectedCategory.value.id)
      isCategorySubscribed.value = true
      toast({
        title: t('app.categories.subscribeSuccess'),
        description: t('app.categories.subscribeMessage', { category: selectedCategory.value.name }),
        duration: 3000,
      })
    }
  } catch (error) {
    console.error('Erreur lors de la modification de l\'abonnement à la catégorie:', error)
    toast({
      title: t('app.categories.subscribeError'),
      description: t('app.categories.subscribeErrorMessage'),
      variant: "destructive",
      duration: 3000,
    })
  }
}

function getCategoryName(categoryId: string): string {
  const category = categories.value.find(c => c.id === categoryId)
  return category ? category.name : ''
}

watch(
  [searchQuery, selectedCategory, selectedBrand, minPrice, maxPrice, isPromotion, inStock],
  () => {
    updateSearch()
  }
)
</script>