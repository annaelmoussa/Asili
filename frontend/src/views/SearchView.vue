<template>
  <div class="search-view">
    <div class="search-filters">
      <h2>Filtres</h2>
      <input v-model="searchQuery" @input="updateSearch" placeholder="Rechercher un produit" />

      <div class="filter-section">
        <h3>Catégorie</h3>
        <select v-model="selectedCategory" @change="updateSearch">
          <option value="">Toutes les catégories</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>

      <div class="filter-section">
        <h3>Marque</h3>
        <select v-model="selectedBrand" @change="updateSearch">
          <option value="">Toutes les marques</option>
          <option v-for="brand in brands" :key="brand" :value="brand">{{ brand }}</option>
        </select>
      </div>

      <div class="filter-section">
        <h3>Prix</h3>
        <input v-model.number="minPrice" @input="updateSearch" type="number" placeholder="Min" />
        <input v-model.number="maxPrice" @input="updateSearch" type="number" placeholder="Max" />
      </div>

      <div class="filter-section">
        <label>
          <input v-model="isPromotion" @change="updateSearch" type="checkbox" />
          En promotion
        </label>
      </div>

      <div class="filter-section">
        <label>
          <input v-model="inStock" @change="updateSearch" type="checkbox" />
          En stock
        </label>
      </div>
    </div>

    <div class="search-results">
      <h2>Résultats de recherche</h2>
      <div v-if="loading">Chargement...</div>
      <div v-else-if="error">Une erreur est survenue: {{ error }}</div>
      <div v-else-if="products.length === 0">Aucun produit trouvé</div>
      <div v-else class="product-list">
        <div
          v-for="product in products"
          :key="product.id"
          class="product-item"
          @click="goToProductPage(product.id)"
        >
          <img :src="extractImageUrl(product.image)" :alt="product.name" />
          <h3>{{ product.name }}</h3>
          <p>{{ product.price.toFixed(2) }} €</p>
          <p>{{ product.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { defaultApi } from '@/api/config'
import type { IBrand, ICategory, IProduct } from '@/api'
import { extractImageUrl } from '@/utils/productUtils'

const route = useRoute()
const router = useRouter()

const searchQuery = ref('')
const selectedCategory = ref('')
const selectedBrand = ref('')
const minPrice = ref<number | null>(null)
const maxPrice = ref<number | null>(null)
const isPromotion = ref<boolean>(false)
const inStock = ref<boolean>(false)

const products = ref<IProduct[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const categories = ref<string[]>([])
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
  selectedCategory.value = (category as string) || ''
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
    const categoriesResponse = await defaultApi.getCategories()
    categories.value = categoriesResponse.data

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
      selectedCategory.value,
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

function updateSearch() {
  const query: Record<string, string | undefined> = {
    query: searchQuery.value || undefined,
    category: selectedCategory.value || undefined,
    brand: selectedBrand.value || undefined,
    minPrice: minPrice.value?.toString() || undefined,
    maxPrice: maxPrice.value?.toString() || undefined,
    isPromotion: isPromotion.value ? 'true' : undefined,
    inStock: inStock.value ? 'true' : undefined
  }

  // Remove undefined values
  Object.keys(query).forEach((key) => query[key] === undefined && delete query[key])

  router.push({ name: 'search', query })
}

function goToProductPage(productId: string) {
  router.push({ name: 'ProductSingleView', params: { productId } })
}

watch(
  [searchQuery, selectedCategory, selectedBrand, minPrice, maxPrice, isPromotion, inStock],
  () => {
    updateSearch()
  }
)
</script>

<style scoped>
.search-view {
  display: flex;
  gap: 20px;
  padding: 20px;
}

.search-filters {
  width: 250px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 5px;
}

.filter-section {
  margin-bottom: 20px;
}

.search-results {
  flex-grow: 1;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.product-item {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  transition: box-shadow 0.3s ease;
}

.product-item:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.product-item img {
  max-width: 100%;
  height: auto;
}
</style>
