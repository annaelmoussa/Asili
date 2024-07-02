<template>
  <div class="cart-container">
    <h1 class="cart-title">{{ $t('app.cart.title') }}</h1>

    <transition name="fade">
      <div v-if="messageVisible" class="message">{{ messageText }}</div>
    </transition>

    <div v-if="cart.items.length === 0" class="cart-empty">
      {{ $t('app.cart.cartEmpty') }}
    </div>

    <template v-else>
      <div v-for="item in cart.items" :key="item.id" class="cart-item">
        <img :src="item.product.image" :alt="item.product.name" class="cart-item-image"/>
        <div class="cart-item-details">
          <h2 class="cart-item-title">{{ item.product.name }}</h2>
          <p class="cart-item-category">{{ item.product.category }}</p>
          <p class="cart-item-description">{{ item.product.description }}</p>
          <div class="cart-item-price-quantity">
            <span class="cart-item-price">{{ currencyStore.formattedPrice(item.product.price) }}</span>
            <div class="quantity-controls">
              <button @click="decrement(item.product.id)" :disabled="item.quantity <= 1" class="quantity-btn">
                <i class="pi pi-minus"></i>
              </button>
              <span class="quantity-number">{{ item.quantity }}</span>
              <button @click="increment(item.product.id)" class="quantity-btn">
                <i class="pi pi-plus"></i>
              </button>
            </div>
            <button @click="removeFromCart(item.product.id)" class="remove-btn">
              <i class="pi pi-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="cart-summary">
        <h2 class="summary-title">{{ $t('app.payment.orderSummary') }}</h2>
        <div class="summary-row">
          <span>{{ $t('app.payment.totalItems') }}</span>
          <span>{{ cart.totalItems }}</span>
        </div>
        <div class="summary-row total">
          <span>{{ $t('app.payment.totalAmount') }}</span>
          <span>{{ formattedTotalPrice }}</span>
        </div>
        <button @click="goToPayment" class="checkout-btn">
          {{ $t('app.payment.proceedToPayment') }}
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cart';
import { useCurrencyStore } from '@/stores/currency';
import { useI18n } from 'vue-i18n';
import { computed, ref } from 'vue';
import { useRouter } from "vue-router";

const { t } = useI18n();
const cart = useCartStore();
const currencyStore = useCurrencyStore();
const router = useRouter();

const messageVisible = ref(false);
const messageText = ref("");

const formattedTotalPrice = computed(() => {
  return currencyStore.formattedPrice(cart.totalPrice);
});

const showMessage = (key: string) => {
  messageText.value = t(`app.cart.${key}`);
  messageVisible.value = true;
  setTimeout(() => {
    messageVisible.value = false;
  }, 3000);
};

const goToPayment = () => {
  router.push({ name: 'StripeCheckoutRedirect' });
};

const increment = (productId: string) => {
  cart.increment(productId);
  showMessage("quantityIncreased");
};

const decrement = (productId: string) => {
  cart.decrement(productId);
  showMessage("quantityDecreased");
};

const removeFromCart = (productId: string) => {
  cart.removeFromCart(productId);
  showMessage("productRemoved");
};
</script>

<style scoped>
.cart-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: Arial, sans-serif;
}

.cart-title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
}

.cart-empty {
  text-align: center;
  font-size: 1.2rem;
  color: #7f8c8d;
  margin-top: 2rem;
}

.cart-item {
  display: flex;
  border-bottom: 1px solid #ecf0f1;
  padding: 2rem 0;
}

.cart-item-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

.cart-item-details {
  flex: 1;
  margin-left: 2rem;
}

.cart-item-title {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.cart-item-category {
  font-size: 1rem;
  color: #16a085;
  margin-bottom: 0.5rem;
}

.cart-item-description {
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-bottom: 1rem;
}

.cart-item-price-quantity {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cart-item-price {
  font-size: 1.2rem;
  color: #10b981;
  font-weight: bold;
}

.quantity-controls {
  display: flex;
  align-items: center;
}

.quantity-btn {
  background: none;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.quantity-btn:hover {
  background-color: #ecf0f1;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-number {
  margin: 0 1rem;
  font-size: 1rem;
}

.remove-btn {
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  font-size: 1.2rem;
  transition: color 0.3s;
}

.remove-btn:hover {
  color: #c0392b;
}

.cart-summary {
  margin-top: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 2rem;
}

.summary-title {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 1rem;
  color: #7f8c8d;
}

.summary-row.total {
  font-weight: bold;
  font-size: 1.2rem;
  color: #2c3e50;
  border-top: 1px solid #ecf0f1;
  padding-top: 1rem;
}

.checkout-btn {
  display: block;
  width: 100%;
  padding: 1rem;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1rem;
}

.checkout-btn:hover {
  background-color: #0d9668;
}

.message {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background-color: #10b981;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>