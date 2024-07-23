<template>
  <div>
    <Table>
      <TableCaption>Liste de vos paiements récents</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID du paiement</TableHead>
          <TableHead>Utilisateur</TableHead>
          <TableHead>Montant</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Date de Paiement</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="payment in payments" :key="payment.id">
          <TableCell>{{ payment.stripePaymentId }}</TableCell>
          <TableCell>{{ payment.userId }}</TableCell>
          <TableCell>{{ currencyFilter(payment.amount) }}</TableCell>
          <TableCell>{{ payment.status }}</TableCell>
          <TableCell>{{ payment.createdAt }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <div v-if="isLoading" class="loading">Chargement des paiements...</div>
    <div v-else-if="payments.length === 0" class="no-payments">Aucun paiement trouvé.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { defaultApi } from '@/api/config';
import type { IPayment } from '@/api';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const payments = ref<IPayment[]>([]);
const isLoading = ref(true);

const currencyFilter = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
};

onMounted(async () => {
  try {
    const response = await defaultApi.getPayments();
    payments.value = response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.loading,
.no-payments {
  text-align: center;
  margin-top: 20px;
}
.payments-table {
  width: 100%;
  border-collapse: collapse;
}
.payments-table th,
.payments-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
.payments-table th {
  background-color: #f4f4f4;
}
</style>
