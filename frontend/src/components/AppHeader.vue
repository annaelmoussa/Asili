<template>
  <header class="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
    <a class="logo flex items-center gap-2 font-semibold" href="#" @click.prevent="goToHomeView">
      <Package2 class="h-6 w-6" />
      <span>{{ $t('app.title') }}</span>
    </a>
    <div class="w-full flex-1 relative">
      <form @submit.prevent="goToSearchPage">
        <div class="relative">
          <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            v-model="searchQuery"
            type="search"
            :placeholder="$t('app.search')"
            class="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            @input="handleSearchInput"
            @focus="showResults = true"
          />
        </div>
      </form>
      <div
        v-if="showResults"
        class="search-results absolute top-full left-0 w-full md:w-2/3 lg:w-1/3 bg-white border border-gray-200 rounded-b-md shadow-lg z-50"
      >
        <div v-if="searchResults.length > 0">
          <div class="search-results-header p-2 bg-gray-100 border-b border-gray-200">
            <h3 class="text-sm font-semibold">Produits</h3>
          </div>
          <div
            v-for="product in searchResults"
            :key="product.id"
            class="search-result-item p-2 hover:bg-gray-100 cursor-pointer"
            @click="goToProductPage(product.id)"
          >
            <div class="flex items-center">
              <img
                :src="extractImageUrl(product.image)"
                :alt="product.name"
                class="w-12 h-12 object-contain mr-3"
              />
              <div>
                <div class="text-sm font-medium">{{ product.name }}</div>
                <div class="text-xs text-gray-600">
                  à partir de {{ product.price.toFixed(2) }} €
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="p-2 text-center text-gray-600">
          Aucun produit trouvé pour "{{ searchQuery }}"
        </div>
      </div>
    </div>
    <div class="flex items-center gap-4">
      <AccountDropdown />
      <Button variant="ghost" size="icon" class="relative" @click="goToCartView">
        <ShoppingCart class="h-5 w-5" />
        <span class="sr-only">{{ $t('app.cart.title') }}</span>
        <span
          class="absolute -top-1 -right-1 h-4 w-4 font-bold rounded-full text-[10px] font-medium dark font-600 flex items-center justify-center"
        >
          {{ cartStore.totalItems }}
        </span>
      </Button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import AccountDropdown from '@/components/AccountDropdown.vue'
import { Package2, Search, ShoppingCart } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { onMounted, onUnmounted } from 'vue'
import { defaultApi } from '@/api/config'
import type { IProduct } from '@/api'
import { extractImageUrl } from '@/utils/productUtils'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()

const searchQuery = ref('')
const searchResults = ref<IProduct[]>([])
const showResults = ref(false)

onMounted(() => {
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

function goToSearchPage() {
  if (searchQuery.value.trim()) {
    if (route.name === 'search') {
      router.replace({
        name: 'search',
        query: { ...route.query, query: searchQuery.value }
      })
    } else {
      router.push({
        name: 'search',
        query: { query: searchQuery.value }
      })
    }
    searchQuery.value = ''
    showResults.value = false
  }
}

async function handleSearchInput() {
  if (searchQuery.value.trim() && searchQuery.value.length >= 3) {
    await handleSearch()
  } else {
    searchResults.value = []
    showResults.value = false
  }
}

async function handleSearch() {
  if (searchQuery.value.trim()) {
    try {
      const response = await defaultApi.searchProducts(searchQuery.value)
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
    router.push({ name: 'ProductSingleView', params: { productId: productId } })
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

watch(searchQuery, (newValue) => {
  if (newValue.length >= 3) {
    handleSearchInput()
  } else {
    searchResults.value = []
    showResults.value = false
  }
})
</script>
