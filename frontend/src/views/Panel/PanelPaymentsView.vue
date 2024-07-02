<template>
  <div>
    <div v-if="isLoading" class="loading">Chargement des paiements...</div>
    <div v-else-if="payments.length">
      <h1>Liste des Paiements</h1>
      <table class="payments-table">
        <thead>
        <tr>
          <th>ID du paiement</th>
          <th>Utilisateur</th>
          <th>Montant</th>
          <th>Statut</th>
          <th>Date de Paiement</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="payment in payments" :key="payment.id">
          <td>{{ payment.stripePaymentId }}</td>
          <td>{{ payment.userId }}</td>
          <td>{{ payment.amount | currencyFilter }}</td>
          <td>{{ payment.status }}</td>
          <td>{{ payment.createdAt | dateFormat }}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="no-payments">Aucun paiement trouvé.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { defaultApi } from '@/api/config';
import type { IPayment } from '@/api';

const payments = ref<IPayment[] | null>([]);
const isLoading = ref(true);

onMounted(async () => {
  isLoading.value = true;
  try {
    const response = await defaultApi.getAllPayments();
    payments.value = response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.loading, .no-payments {
  text-align: center;
  font-size: 1.2em;
  color: #7f8c8d;
}
.payments-table {
  width: 100%;
  border-collapse: collapse;
}
.payments-table th, .payments-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
.payments-table th {
  background-color: #f4f4f4;
}
</style>