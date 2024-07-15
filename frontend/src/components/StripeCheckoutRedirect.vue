<template>
  <div class="stripe-redirect-container">
    <div v-if="isLoading" class="loading">{{ $t('app.payment.loading') }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCartStore } from '@/stores/cart';
import { useUserStore } from '@/stores/user';
import { defaultApi } from '@/api/config';
import { useRouter } from 'vue-router';
import { loadStripe } from '@stripe/stripe-js';

const cart = useCartStore();
const userStore = useUserStore()
const router = useRouter();
const isLoading = ref(true);
const error = ref('');
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

onMounted(async () => {
  cart.init();
  await createPaymentSession();
});

const createPaymentSession = async () => {
  try {
    console.log(cart.items, userStore.user.id);
    const response = await defaultApi.createPaymentSession(userStore.user.id, cart.items);
    const sessionId = response.data.sessionId;

    const stripe = await loadStripe(stripePublicKey);
    if (stripe) {
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        console.error('Stripe redirect error:', error);
        this.error = error.message;
      }
    } else {
      throw new Error('Failed to load Stripe');
    }
  } catch (err) {
    console.error('Failed to create payment session:', err);
    error.value = 'Une erreur est survenue lors de la redirection vers le paiement.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.stripe-redirect-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.loading, .error {
  font-size: 1.2rem;
  color: #2c3e50;
  text-align: center;
}

.error {
  color: #e74c3c;
}
</style>