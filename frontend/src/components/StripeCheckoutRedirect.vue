<template>
  <div class="stripe-redirect-container">
    <div v-if="isLoading" class="loading">{{ $t('app.payment.loading') }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import { defaultApi } from '@/api/config'
import { loadStripe } from '@stripe/stripe-js'
import type { Stripe } from '@stripe/stripe-js'
import type { PaymentSessionRequest } from '@/api'

const cart = useCartStore()
const userStore = useUserStore()
const isLoading = ref(true)
const error = ref('')
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY

onMounted(async () => {
  if (!stripePublicKey) {
    error.value = "La clé publique Stripe n'est pas définie"
    isLoading.value = false
    return
  }

  await cart.init()
  await createPaymentSession()
})

const adaptCartItemsToPaymentSessionRequest = (cartItems: any[]): PaymentSessionRequest[] => {
  return cartItems.map((item) => ({
    id: item.id,
    product: {
      id: item.product.id,
      name: item.product.name,
      price: item.product.price
    },
    quantity: item.quantity
  }))
}

const createPaymentSession = async () => {
  try {
    if (!userStore.user || !userStore.user.id) {
      throw new Error("Afin de procéder au paiement, veuillez vous connecter")
    }

    if (!stripePublicKey) {
      throw new Error("La clé publique Stripe n'est pas définie")
    }

    const adaptedItems = adaptCartItemsToPaymentSessionRequest(cart.items)
    console.log('Adapted items:', adaptedItems)
    const response = await defaultApi.createPaymentSession(userStore.user.id, adaptedItems)
    const sessionId = response.data.sessionId

    const stripe = await loadStripe(stripePublicKey)
    if (!stripe) {
      throw new Error('Échec du chargement de Stripe')
    }

    const { error: stripeError } = await stripe.redirectToCheckout({ sessionId })
    if (stripeError) {
      console.error('Erreur de redirection Stripe:', stripeError)
      throw new Error(stripeError.message)
    }
  } catch (err) {
    console.error('Échec de la création de la session de paiement:', err)
    error.value =
      err instanceof Error
        ? err.message
        : 'Une erreur est survenue lors de la redirection vers le paiement.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.stripe-redirect-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.loading,
.error {
  font-size: 1.2rem;
  color: #2c3e50;
  text-align: center;
}

.error {
  color: #e74c3c;
}
</style>
