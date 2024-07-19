<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Gestion des stocks</h1>

    <!-- Stock Alert Section -->
    <div class="mb-8 bg-white shadow rounded-lg p-6">
      <h2 class="text-2xl font-semibold mb-4">Alertes de stock bas</h2>
      <ul v-if="lowStockProducts.length > 0" class="space-y-2">
        <li
          v-for="product in lowStockProducts"
          :key="product.id"
          class="flex justify-between items-center bg-red-100 p-3 rounded"
        >
          <span>{{ product.name }}</span>
          <span class="font-semibold">Stock actuel: {{ product.stock }}</span>
          <span class="font-semibold">Seuil bas: {{ product.lowStockThreshold }}</span>
        </li>
      </ul>
      <p v-else class="text-gray-600">Pas d'alertes de stock bas pour le moment.</p>
    </div>

    <!-- Stock Update Section -->
    <div class="mb-8 bg-white shadow rounded-lg p-6">
      <h2 class="text-2xl font-semibold mb-4">Mise à jour du stock</h2>
      <div class="flex space-x-4 mb-4">
        <select
          v-model="selectedProductId"
          @change="onProductSelect"
          class="flex-grow p-2 border rounded"
        >
          <option value="">Sélectionnez un produit</option>
          <option v-for="product in allProducts" :key="product.id" :value="product.id">
            {{ product.name }} (Stock actuel: {{ product.stock }})
          </option>
        </select>
        <input
          v-model.number="stockChange"
          type="number"
          placeholder="Quantité à ajouter/retirer"
          class="p-2 border rounded w-48"
        />
        <button
          @click="updateStock"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          :disabled="!isProductSelected"
        >
          Mettre à jour le stock
        </button>
      </div>
      <div class="flex space-x-4">
        <input
          v-model.number="lowStockThreshold"
          type="number"
          placeholder="Nouveau seuil de stock bas"
          class="p-2 border rounded w-48"
        />
        <button
          @click="updateLowStockThreshold"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          :disabled="!isProductSelected"
        >
          Mettre à jour le seuil
        </button>
      </div>
    </div>

    <!-- Stock History Chart -->
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-2xl font-semibold mb-4">Évolution du stock</h2>
      <select
        v-model="selectedProductForChart"
        @change="updateChartData"
        class="w-full p-2 border rounded mb-4"
      >
        <option value="">Sélectionnez un produit</option>
        <option v-for="product in allProducts" :key="product.id" :value="product.id">
          {{ product.name }}
        </option>
      </select>
      <LineChart
        v-if="isChartDataReady"
        :data="chartData.datasets[0].data"
        :index="chartData.index"
        :categories="[chartData.datasets[0].label]"
        :colors="chartColors"
        :keyElement="chartKey"
        class="h-64"
      />
      <p v-else-if="selectedProductForChart" class="text-gray-600">
        Aucune donnée d'historique disponible pour ce produit.
      </p>
      <p v-else class="text-gray-600">Sélectionnez un produit pour voir l'évolution du stock.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useProductStore } from '@/stores/productStore'
import LineChart from '@/components/ChartLine.vue'
import type { IProduct } from '@/api'

interface StockHistory {
  date: string
  quantity: number
}

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: { date: string; value: number }[]
  }[]
  index: string
}

const productStore = useProductStore()
const lowStockProducts = ref<IProduct[]>([])
const allProducts = ref<IProduct[]>([])
const selectedProductId = ref<string>('')
const selectedProductForChart = ref<string>('')
const stockChange = ref<number>(0)
const lowStockThreshold = ref<number | null>(null)
const chartData = ref<ChartData>({
  labels: [],
  datasets: [{ label: 'Stock', data: [] }],
  index: 'date'
})
const chartColors = ref<string[]>(['rgb(59, 130, 246)']) // Tailwind blue-500
const chartKey = ref<string>('stock-chart')

const isChartDataReady = computed(() => {
  return (
    chartData.value.labels.length > 0 &&
    chartData.value.datasets.length > 0 &&
    chartData.value.datasets[0].data.length > 0
  )
})

const isProductSelected = computed(() => selectedProductId.value !== '')
const isProductSelectedForChart = computed(() => selectedProductForChart.value !== '')

onMounted(async () => {
  await productStore.fetchProducts()
  allProducts.value = productStore.products
  lowStockProducts.value = await productStore.getLowStockProducts()

  selectedProductId.value = ''
  selectedProductForChart.value = ''
})

const onProductSelect = () => {
  if (selectedProductId.value) {
    const product = allProducts.value.find((p) => p.id === selectedProductId.value)
    if (product) {
      stockChange.value = 0
      lowStockThreshold.value = product.lowStockThreshold
    }
  } else {
    stockChange.value = 0
    lowStockThreshold.value = null
  }
}

const updateStock = async () => {
  if (isProductSelected.value && stockChange.value !== 0) {
    await productStore.updateStock(selectedProductId.value, stockChange.value)
    await refreshData()
  }
}

const updateLowStockThreshold = async () => {
  if (isProductSelected.value && lowStockThreshold.value !== null) {
    await productStore.updateLowStockThreshold(selectedProductId.value, lowStockThreshold.value)
    await refreshData()
  }
}

const refreshData = async () => {
  await productStore.fetchProducts()
  allProducts.value = productStore.products
  lowStockProducts.value = await productStore.getLowStockProducts()
  selectedProductId.value = ''
  selectedProductForChart.value = ''
  stockChange.value = 0
  lowStockThreshold.value = null
  await updateChartData()
}

const updateChartData = async () => {
  if (isProductSelectedForChart.value) {
    const history: StockHistory[] = await productStore.getStockHistory(
      selectedProductForChart.value
    )
    if (history && history.length > 0) {
      const validData = history.filter((entry) => entry.date != null && entry.quantity != null)
      if (validData.length > 0) {
        chartData.value = {
          labels: validData.map((entry) => new Date(entry.date).toLocaleDateString()),
          datasets: [
            {
              label: 'Stock',
              data: validData.map((entry) => ({
                date: new Date(entry.date).toLocaleDateString(),
                value: entry.quantity
              }))
            }
          ],
          index: 'date'
        }
        chartKey.value = `stock-chart-${selectedProductForChart.value}`
      } else {
        resetChartData('Données invalides')
      }
    } else {
      resetChartData('Aucune donnée')
    }
  } else {
    resetChartData()
  }
}

const resetChartData = (reason: string = '') => {
  chartData.value = {
    labels: [],
    datasets: [{ label: 'Stock', data: [] }],
    index: 'date'
  }
  chartKey.value = `stock-chart-${reason ? reason.toLowerCase().replace(/\s+/g, '-') : 'empty'}`
}

watch(selectedProductForChart, updateChartData)
</script>
