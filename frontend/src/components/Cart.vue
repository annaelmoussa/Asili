<template>
  <div class="cart-container">
    <h1 class="title">{{ $t('app.cart.title') }}</h1>
    <transition name="fade">
      <div v-if="messageVisible" class="message">{{ messageText }}</div>
    </transition>
    <div v-for="item in cart.items" :key="item.id" class="product-details-container">
      <img :src="item.image" alt="Product image" class="product-image-detail"/>
      <div class="product-details">
        <h1 class="product-title">{{ item.name }}</h1>
        <h2 class="product-category">{{ item.category }}</h2>
        <p class="product-description-detail">{{ item.description }}</p>
        <div class="price-stock-container">
          <span class="product-price-detail">{{ item.price }}</span>
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
      </div>
    </div>
    <div v-if="cart.items.length === 0" class="no-product">{{ $t('app.cart.noProducts') }}</div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cart';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const cart = useCartStore();

const showMessage = (key) => {
  messageText.value = t(`app.cart.${key}`);
  messageVisible.value = true;
  setTimeout(() => {
    messageVisible.value = false;
  }, 3000);
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
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
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
  transition: background-color 0.3s, color 0.3s;
  font-size: 1em;
  margin-top: 10px;
  margin-left: 10px;
}
.remove-from-cart:hover {
  background-color: #e74c3c;
  color: #ffffff;
}

.loading, .no-product {
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
  transition: background-color 0.3s, color 0.3s;
  display: inline-flex;
  align-items: center;
}

.remove-from-cart:hover {
  background-color: #e74c3c;
  color: #ffffff;
}
</style>
