<template>
  <div class="cart-container">
    <h1 class="title">{{ $t('app.cart.title') }}</h1>
    <transition name="fade">
      <div v-if="messageVisible" class="message">{{ messageText }}</div>
    </transition>
    <div v-for="item in sortedCartItems" :key="item.id" class="product-details-container">
      <img :src="item.product.image" alt="Product image" class="product-image-detail" />
      <div class="product-details">
        <h1 class="product-title">{{ item.product.name }}</h1>
        <h2 class="product-category">{{ item.product.category?.name }}</h2>
        <p class="product-description-detail">{{ item.product.description }}</p>
        <div class="price-stock-container">
          <span class="product-price-detail">{{ item.product.price }}</span>
          <div class="quantity-controls">
            <button @click="decrement(item.id)" :disabled="item.quantity <= 1" class="quantity-btn">
              <i class="pi pi-minus"></i>
            </button>
            <span class="quantity-number">{{ item.quantity }}</span>
            <button @click="increment(item.id)" class="quantity-btn">
              <i class="pi pi-plus"></i>
            </button>
            <button @click="removeFromCart(item.id)" class="remove-from-cart">
              <i class="pi pi-trash"></i>
            </button>
          </div>
        </div>
        <div v-if="item.reservationExpires" class="reservation-timer">
          {{
            $t('app.cart.reservationTime', {
              time: getReservationTimeRemaining(item.reservationExpires)
            })
          }}
        </div>
      </div>
    </div>
    <div v-if="cart.items.length === 0" class="no-product">{{ $t('app.cart.cartEmpty') }}</div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import { useI18n } from 'vue-i18n'
import { onMounted, ref, computed, onUnmounted } from 'vue'

const { t } = useI18n()
const cart = useCartStore()
const user = useUserStore()
const messageVisible = ref(false)
const messageText = ref('')
const currentTime = ref(Date.now())

const sortedCartItems = computed(() => {
  return [...cart.items].sort((a, b) => a.id.localeCompare(b.id))
})

onMounted(() => {
  cart.init()
  startTimer()
})

const showMessage = (key: string) => {
  messageText.value = t(`app.cart.${key}`)
  messageVisible.value = true
  setTimeout(() => {
    messageVisible.value = false
  }, 3000)
}

const increment = async (itemId: string) => {
  await cart.increment(itemId)
  showMessage('quantityIncreased')
}

const decrement = async (itemId: string) => {
  await cart.decrement(itemId)
  showMessage('quantityDecreased')
}

const removeFromCart = async (itemId: string) => {
  await cart.removeFromCart(itemId)
  showMessage('productRemoved')
}

const getReservationTimeRemaining = (reservationExpires: string | null): string | null => {
  if (!reservationExpires) return null
  const expires = new Date(reservationExpires).getTime()
  const diff = expires - currentTime.value
  if (diff <= 0) return null
  const minutes = Math.floor(diff / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

let timerInterval: number | null = null

const startTimer = () => {
  timerInterval = window.setInterval(() => {
    currentTime.value = Date.now()
  }, 1000)
}

onMounted(() => {
  cart.init()
  startTimer()
})

onUnmounted(() => {
  if (timerInterval !== null) {
    clearInterval(timerInterval)
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.message {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px;
  background-color: #dff0d8;
  color: #3c763d;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: auto;
  max-width: 300px;
  text-align: center;
}
.cart-container {
  max-width: 800px; /* ou la largeur que tu préfères */
  margin: auto; /* centre le conteneur */
  padding: 20px;
}
.product-details-container {
  display: flex;
  flex-direction: row;
  align-items: start;
  gap: 20px;
  padding: 20px;
  background: #fff;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  margin-bottom: 20px; /* espace entre chaque produit */
}

.product-image-detail {
  width: 200px; /* ajuste selon tes besoins */
  height: 200px; /* ajuste pour maintenir l'aspect ratio */
  object-fit: cover;
  border-radius: 5px;
}

.product-details {
  flex: 1;
  text-align: left;
}

.product-title {
  font-size: 1.8em;
  color: #2c3e50;
  font-weight: bold;
}

.product-category {
  font-size: 1.2em;
  color: #16a085;
  margin-bottom: 5px;
}

.product-description-detail {
  font-size: 1em;
  color: #7f8c8d;
  margin: 10px 0;
}

.price-stock-container {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin: 10px 0;
}

.product-price-detail {
  font-size: 1.5em;
  color: #10b981;
  font-weight: bold;
}

.remove-from-cart {
  background-color: #ffffff;
  border: 2px solid #e74c3c;
  border-radius: 5px;
  color: #e74c3c;
  cursor: pointer;
  transition:
    background-color 0.3s,
    color 0.3s;
  font-size: 1em;
  margin-top: 10px;
  margin-left: 10px;
}
.remove-from-cart:hover {
  background-color: #e74c3c;
  color: #ffffff;
}

.loading,
.no-product {
  text-align: center;
  font-size: 1.2em;
  color: #7f8c8d;
  margin-top: 20px; /* ajout d'un peu d'espace au-dessus du message */
}
button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px 10px; /* ajuster selon besoin */
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

button:disabled {
  color: #ccc; /* Grise les icônes désactivées */
}

button i {
  font-size: 1.2em; /* Ajuste la taille des icônes si nécessaire */
}

.remove-from-cart {
  padding: 5px 10px;
  margin-left: 10px;
  border: 2px solid #e74c3c;
  border-radius: 5px;
  color: #e74c3c;
  transition:
    background-color 0.3s,
    color 0.3s;
  display: inline-flex;
  align-items: center;
}

.remove-from-cart:hover {
  background-color: #e74c3c;
  color: #ffffff;
}

.reservation-timer {
  margin-top: 10px;
  font-size: 0.9em;
  color: #e67e22;
}
</style>
