<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import AccountDropdown from '@/components/AccountDropdown.vue'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { defaultApi } from '@/api/config'
import type { IProduct } from '@/api'

const router = useRouter()
const cartStore = useCartStore()

const searchQuery = ref('')
const searchResults = ref<IProduct[]>([])
const showResults = ref(false)

// Ajoutez ces refs si vous voulez permettre le filtrage par ces critères
const selectedCategory = ref('')
const selectedBrand = ref('')
const minPrice = ref<number | undefined>(undefined)
const maxPrice = ref<number | undefined>(undefined)
const isPromotion = ref<boolean | undefined>(undefined)
const inStock = ref<boolean | undefined>(undefined)

onMounted(async () => {
  await cartStore.init()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

function goToHomeView() {
  router.push({ name: 'home' })
}

function goToCartView() {
  router.push({ name: 'cart' })
}

async function handleSearch() {
  if (searchQuery.value.trim()) {
    try {
      console.log('Recherche en cours...')
      console.log('Critères de recherche:', {
        searchQuery: searchQuery.value,
        selectedCategory: selectedCategory.value,
        selectedBrand: selectedBrand.value,
        minPrice: minPrice.value,
        maxPrice: maxPrice.value,
        isPromotion: isPromotion.value,
        inStock: inStock.value
      })
      const response = await defaultApi.searchProducts(
        searchQuery.value,
        selectedCategory.value,
        selectedBrand.value,
        minPrice.value,
        maxPrice.value,
        isPromotion.value,
        inStock.value
      )
      searchResults.value = response.data
      showResults.value = true
    } catch (error) {
      console.error('Erreur lors de la recherche:', error)
      searchResults.value = []
    }
  } else {
    searchResults.value = []
    showResults.value = false
  }
}

function goToProductPage(productId: string | undefined) {
  if (productId) {
    router.push({ name: 'product-details', params: { id: productId } })
    searchQuery.value = ''
    showResults.value = false
  } else {
    console.error('Tentative de navigation vers un produit sans ID')
  }
}

function handleClickOutside(event: Event) {
  const searchContainer = document.querySelector('.search-container')
  if (searchContainer && !searchContainer.contains(event.target as Node)) {
    showResults.value = false
  }
}

watch(searchQuery, () => {
  if (searchQuery.value.length >= 3) {
    handleSearch()
  } else {
    searchResults.value = []
    showResults.value = false
  }
})
</script>

<template>
  <header class="header">
    <a class="logo" href="#" @click.prevent="goToHomeView">{{ $t('app.title') }}</a>
    <div class="search-container">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="$t('app.search')"
        class="search-input"
        @keyup.enter="handleSearch"
      />
      <button class="search-button" @click="handleSearch">
        <i class="pi pi-search"></i>
      </button>
      <div v-if="showResults" class="search-results">
        <div v-if="searchResults.length > 0">
          <div class="search-results-header">
            <h3>Produits</h3>
          </div>
          <div
            v-for="product in searchResults"
            :key="product.id"
            class="search-result-item"
            @click="goToProductPage(product.id)"
          >
            <img :src="product.image" :alt="product.name" class="search-result-image" />
            <div class="search-result-info">
              <div class="search-result-name">{{ product.name }}</div>
              <div class="search-result-price">à partir de {{ product.price.toFixed(2) }} €</div>
            </div>
          </div>
        </div>
        <div v-else class="no-results">Aucun produit trouvé pour "{{ searchQuery }}"</div>
      </div>
    </div>
    <div class="header-icons">
      <AccountDropdown />
      <div class="icon-container" @click="goToCartView">
        <i class="pi pi-shopping-cart"></i>
        <span>{{ $t('app.cart.title') }} ({{ cartStore.totalItems }})</span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #10b981;
  padding: 10px 20px;
}

.logo {
  font-size: 1.5em;
  font-weight: bold;
  color: #ffffff;
  text-decoration: none;
}

.search-container {
  position: relative;
  width: 400px;
}

.search-input {
  width: 100%;
  padding: 10px;
  font-size: 1em;
  border: none;
  border-radius: 5px;
  outline: none;
}

.search-button {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  padding: 0 15px;
  background-color: #ffffff;
  border: none;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
}

.search-button i {
  color: #10b981;
  font-size: 1.2em;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 5px 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
}

.search-results-header {
  padding: 10px 15px;
  border-bottom: 1px solid #ddd;
  background-color: #f9f9f9;
}

.search-results-header h3 {
  margin: 0;
  font-size: 1em;
  color: #333;
}

.search-result-item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #eee;
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-item:hover {
  background-color: #f0f0f0;
}

.search-result-image {
  width: 60px;
  height: 60px;
  object-fit: contain;
  margin-right: 15px;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.search-result-info {
  flex-grow: 1;
}

.search-result-name {
  font-weight: bold;
  margin-bottom: 4px;
}

.search-result-price {
  color: #10b981;
  font-size: 0.9em;
}

.no-results {
  padding: 15px;
  text-align: center;
  color: #666;
}

.header-icons {
  display: flex;
  align-items: center;
}

.icon-container {
  display: flex;
  align-items: center;
  margin-left: 20px;
  color: #ffffff;
  cursor: pointer;
}

.icon-container i {
  margin-right: 5px;
  font-size: 1.2em;
}

.icon-container span {
  font-size: 1em;
}
</style>
