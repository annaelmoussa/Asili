<template>
  <div class="container mx-auto p-6 max-w-6xl">
    <h1 class="text-3xl font-bold mb-6 text-center">{{ $t('app.orders.detail') }}</h1>
    <div v-if="isLoading" class="flex justify-center items-center h-full">
      {{ $t('app.orders.loading') }}
    </div>
    <div v-else-if="order">
      <Card class="mb-6">
        <CardHeader class="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h2 class="text-xl font-semibold">Commande #{{ order._id }}</h2>
            <p class="text-sm text-gray-500">Commandé le : {{ formatDate(order._id) }}</p>
          </div>
          <div class="text-right">
            <p class="text-lg font-semibold">Montant total : {{ formattedPrice(order.amount) }}</p>
            <p>
              Statut : <span :class="statusClass(order.status)">{{ order.status }}</span>
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <h3 class="text-lg font-semibold mb-2">Adresse de livraison</h3>
              <p>{{ order.shippingAddress || 'Non spécifiée' }}</p>
            </div>
            <div>
              <h3 class="text-lg font-semibold mb-2">Informations de paiement</h3>
              <p>Mode de paiement : Visa ***4242</p>
              <p>ID de paiement Stripe : {{ order.payment?.stripePaymentId || 'Non spécifié' }}</p>
              <p>Statut du paiement : {{ order.payment?.status || 'Non spécifié' }}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 class="text-lg font-semibold">Articles commandés</h3>
        </CardHeader>
        <CardContent>
          <div v-for="item in order.items" :key="item._id" class="flex items-start mb-4">
            <img
              :src="extractImageUrl(item.productImage)"
              alt="Product Image"
              class="w-24 h-24 object-cover mr-4"
            />
            <div>
              <p class="font-semibold">{{ item.productName }}</p>
              <p>{{ item.quantity }}x - {{ formattedPrice(item.priceAtPurchase) }}</p>
              <Button
                variant="link"
                class="mt-2 text-blue-500"
                @click="handleReorder(item.productId)"
                >Acheter à nouveau</Button
              >
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    <div v-else class="flex justify-center items-center h-full">{{ $t('app.orders.noOrder') }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCurrencyStore } from '@/stores/currency'
import { defaultApi } from '@/api/config'
import { useI18n } from 'vue-i18n'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { extractImageUrl } from '@/utils/productUtils'

// Define TypeScript interfaces for order and related properties
interface OrderItem {
  _id: string
  productName: string
  productImage: string
  quantity: number
  priceAtPurchase: number
  productId: string
}

interface Payment {
  stripePaymentId: string
  status: string
}

interface Order {
  _id: string
  amount: number
  status: string
  shippingAddress: string
  payment: Payment
  items: OrderItem[]
}

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const order = ref<Order | null>(null)
const isLoading = ref(true)
const currencyStore = useCurrencyStore()

const formattedPrice = (price: number) => {
  return currencyStore.formattedPrice(price)
}

const formatDate = (id: string | undefined) => {
  if (!id) return 'Date inconnue'
  const timestamp = parseInt(id.substring(0, 8), 16) * 1000
  return new Date(timestamp).toLocaleDateString()
}

const handleReorder = (productId: string | undefined) => {
  if (productId === undefined) return
  return router.push({ name: 'ProductSingleView', params: { productId } })
}

const statusClass = (status: string) => {
  switch (status) {
    case 'Paid':
      return 'text-green-500'
    case 'Pending':
      return 'text-yellow-500'
    case 'Cancelled':
      return 'text-red-500'
    default:
      return 'text-gray-500'
  }
}

onMounted(async () => {
  try {
    const orderId = route.params.orderId as string
    const response = await defaultApi.getMongoOrder(orderId)
    order.value = response.data
    console.log('Order data:', order.value)
  } catch (error) {
    console.error('Failed to fetch order details:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
