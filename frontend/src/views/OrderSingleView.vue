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
            <h2 class="text-xl font-semibold">Commande #{{ order.id }}</h2>
            <p class="text-sm text-gray-500">Commandé le : {{ formatDate(order.createdAt) }}</p>
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
              <p>{{ order.shipping?.address || 'Non spécifiée' }}</p>
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

      <Card class="mb-6" v-if="order?.shipping?.trackingNumber">
        <CardHeader>
          <h3 class="text-lg font-semibold">Informations de livraison</h3>
        </CardHeader>
        <CardContent>
          <p>Numéro de suivi : {{ order.shipping.trackingNumber }}</p>
          <div v-if="trackingInfo">
            <p>Statut : {{ trackingInfo.status }}</p>
            <p>Emplacement actuel : {{ trackingInfo.location }}</p>
            <h4 class="mt-4 font-semibold">Historique :</h4>
            <ul>
              <li v-for="(event, index) in trackingInfo.history" :key="index">
                {{ event.status }} - {{ event.location }} ({{ formatDate(event.timestamp.toISOString()) }})
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 class="text-lg font-semibold">Articles commandés</h3>
        </CardHeader>
        <CardContent>
          <div v-for="item in order.items" :key="item.id" class="flex items-start mb-4">
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

interface IMongoOrder {
  id: string;
  userId: string;
  stripeInvoiceId: string;
  amount: number;
  status: string;
  createdAt: string,
  items: {
    id: string;
    productId: string;
    productName: string;
    productDescription: string;
    priceAtPurchase: number;
    productImage: string;
    quantity: number;
  }[];
  shipping?: {
    id: string;
    address: string;
    status: string;
    trackingNumber?: string;
  };
  payment?: {
    id: string;
    stripePaymentId: string;
    amount: number;
    status: string;
  };
}

interface ITrackingInfo {
  trackingCode: string;
  status: string;
  location: string;
  timestamp: Date;
  history: {
    status: string;
    location: string;
    timestamp: Date;
  }[];
}

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const order = ref<IMongoOrder | null>(null)
const isLoading = ref(true)
const currencyStore = useCurrencyStore()
const trackingInfo = ref<ITrackingInfo | null>(null);

const fetchTrackingInfo = async () => {
  if (order.value?.shipping?.trackingNumber) {
    try {
      const response = await defaultApi.getTrackingInfo(order.value.shipping.trackingNumber);
      trackingInfo.value = response.data;
    } catch (error) {
      console.error('Failed to fetch tracking info:', error);
    }
  }
};

const formattedPrice = (price: number) => {
  return currencyStore.formattedPrice(price)
}

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleDateString('fr-FR', options);
};

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
    await fetchTrackingInfo();
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
