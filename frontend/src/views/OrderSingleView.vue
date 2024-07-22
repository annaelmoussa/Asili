<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Détails de la commande</h1>
    <div v-if="isLoading" class="flex justify-center items-center h-full">{{ $t('app.orders.loading') }}</div>
    <div v-else-if="order">
      <div class="bg-white p-6 rounded shadow mb-6">
        <h2 class="text-xl font-semibold">Commande #{{ order._id }}</h2>
        <p>Commandé le : {{ formatDate(order._id) }}</p>
        <p>Montant total : {{ formattedPrice(order.amount) }}</p>
        <p>Statut : {{ order.status }}</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <h3 class="text-lg font-semibold">Adresse de livraison</h3>
            <p>{{ order.shippingAddress || 'Non spécifiée' }}</p>
          </div>
          <div>
            <h3 class="text-lg font-semibold">Informations de paiement</h3>
            <p>Mode de paiement : Visa ***4242</p>
            <p>ID de paiement Stripe : {{ order.payment?.stripePaymentId || 'Non spécifié' }}</p>
            <p>Statut du paiement : {{ order.payment?.status || 'Non spécifié' }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded shadow">
        <h3 class="text-lg font-semibold mb-4">Articles commandés</h3>
        <div v-for="item in order.items" :key="item._id" class="flex items-start mb-4">
          <img :src="item.productImage" alt="Product Image" class="w-20 h-20 object-cover mr-4">
          <div>
            <p class="font-semibold">{{ item.productName }}</p>
            <p>{{ item.quantity }}x - {{ formattedPrice(item.priceAtPurchase) }}</p>
            <button class="mt-2 text-blue-500" @click="handleReorder(item.productId)">Acheter à nouveau</button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex justify-center items-center h-full">{{ $t('app.orders.noOrder') }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCurrencyStore } from '@/stores/currency';
import { defaultApi } from '@/api/config';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const route = useRoute();
const router = useRouter()
const order = ref(null);
const isLoading = ref(true);
const currencyStore = useCurrencyStore();

const formattedPrice = (price: number) => {
  return currencyStore.formattedPrice(price);
};

const formatDate = (id: string | undefined) => {
  if (!id) return 'Date inconnue';
  const timestamp = parseInt(id.substring(0, 8), 16) * 1000;
  return new Date(timestamp).toLocaleDateString();
};

const handleReorder = (productId: string | undefined) => {
  if (productId === undefined)
    return;

  return router.push({ name: 'ProductSingleView', params: { productId } })
};

onMounted(async () => {
  try {
    const orderId = route.params.orderId as string;
    const response = await defaultApi.getMongoOrder(orderId);
    order.value = response.data;
    console.log('Order data:', order.value);
  } catch (error) {
    console.error('Failed to fetch order details:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.container {
  max-width: 800px;
}
.loading, .no-order {
  text-align: center;
  margin-top: 20px;
}
</style>
