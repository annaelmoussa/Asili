<template>
  <Table>
    <TableCaption>Liste de vos commandes récentes.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>ID de commande</TableHead>
        <TableHead>Date</TableHead>
        <TableHead>Montant</TableHead>
        <TableHead>Statut</TableHead>
        <TableHead class="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="order in orders" :key="order.id">
        <TableCell class="font-medium">{{ order.id }}</TableCell>
        <TableCell>{{ formatDate(order._id) }}</TableCell>
        <TableCell>{{ formattedPrice(order.amount) }}</TableCell>
        <TableCell>{{ order.status }}</TableCell>
        <TableCell class="text-right">
          <button @click="viewOrderDetails(order.id)">Voir détails</button>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
  <div v-if="isLoading" class="loading">{{ $t('app.orders.loading') }}</div>
  <div v-else-if="orders.length === 0" class="no-orders">{{ $t('app.orders.noOrder') }}</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCurrencyStore } from '@/stores/currency';
import { useUserStore } from '@/stores/user';
import { defaultApi } from '@/api/config';
import { useI18n } from "vue-i18n";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Order {
  id: string;
  _id: string;
  amount: number;
  status: string;
}

const { t } = useI18n();
const userStore = useUserStore();
const router = useRouter();
const orders = ref<Order[]>([]);
const isLoading = ref(true);
const currencyStore = useCurrencyStore();

const formattedPrice = (price: number) => {
  return currencyStore.formattedPrice(price);
};

const formatDate = (id: string) => {
  const timestamp = parseInt(id.substring(0, 8), 16) * 1000;
  return new Date(timestamp).toLocaleDateString();
};

const viewOrderDetails = (orderId: string | undefined) => {
  if (orderId === undefined)
    return;

  router.push({ name: 'OrderSingleView', params: { orderId } });
};

onMounted(async () => {
  try {
    const userId = userStore.user?.id;
    if (userId) {
      const response = await defaultApi.getMongoOrders(userId);
      orders.value = response.data;
    } else {
      console.error('User ID is undefined');
    }
  } catch (error) {
    console.error('Failed to fetch orders:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.orders-table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table th, .orders-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.orders-table th {
  background-color: #f2f2f2;
}

.loading, .no-orders {
  text-align: center;
  margin-top: 20px;
}
</style>