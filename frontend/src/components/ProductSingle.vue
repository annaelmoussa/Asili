<template>
  <div v-if="isLoading" class="loading">{{ $t('app.ProductSingleView.loading') }}</div>
  <div v-else-if="product">
    <div class="product-details-container">
      <img
        :src="extractImageUrl(product.image)"
        alt="Image du produit"
        class="product-image-detail"
      />
      <div class="product-details">
        <h1 class="product-title">{{ product.name }}</h1>
        <span
          class="product-stock"
          :class="{ 'in-stock': product.stock > 0, 'out-of-stock': product.stock <= 0 }"
        >
          {{ product.stock > 0 ? $t('app.products.inStock') : $t('app.products.outOfStock') }}
        </span>
        <h2 class="product-category">{{ product.category?.name }}</h2>
        <p class="product-description-detail">{{ product.description }}</p>
        <div class="price-stock-container">
          <span class="product-price-detail">{{ formattedPrice }}</span>
        </div>
        <div class="flex flex-col gap-y-3.5 w-1/4">
          <Button @click="addToCart" class="add-to-cart-detail" :disabled="product.stock <= 0">
            <i class="pi pi-shopping-cart"></i>
            <span class="ml-4">{{ $t('app.products.addToCart') }}</span>
          </Button>
          <Button v-if="user.isAuthenticated" @click="togglePriceChangeSubscription" :variant="isPriceChangeSubscribed ? 'destructive' : 'default'">
              {{ isPriceChangeSubscribed ? $t('app.products.unsubscribeFromPriceChange') : $t('app.products.notifyWhenPriceChanges') }}
          </Button>
          <Button v-if="user.isAuthenticated && product.stock <= 0" @click="toggleRestockSubscription" :variant="isSubscribed ? 'destructive' : 'default'">
            {{ isSubscribed ? $t('app.products.unsubscribeFromRestock') : $t('app.products.notifyWhenInStock') }}
          </Button>
        </div>
      </div>
    </div>
    <transition name="fade">
      <div v-if="messageVisible" class="message">
        {{ $t('app.cart.productAdded') }}
      </div>
    </transition>
  </div>
  <div v-else class="no-product">{{ $t('app.ProductSingleView.noProduct') }}</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCurrencyStore } from '@/stores/currency'
import { useCartStore } from '@/stores/cart'
import { defaultApi } from '@/api/config'
import type { IProduct } from '@/api'
import { useI18n } from 'vue-i18n'
import { extractImageUrl } from '@/utils/productUtils'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { useUserStore } from "@/stores/user";

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const user = useUserStore()
const product = ref<IProduct | null>(null)
const isLoading = ref(true)
const currencyStore = useCurrencyStore()
const messageVisible = ref(false)
const messageText = ref('')
const cart = useCartStore();

const isSubscribed = ref(false);
const isPriceChangeSubscribed = ref(false);

const formattedPrice = computed(() => {
  if (product.value?.price !== undefined) {
    return currencyStore.formattedPrice(product.value.price)
  } else {
    return 'Prix non disponible'
  }
})

onMounted(async () => {
  try {
    const productId = route.params.productId as string;
    const response = await defaultApi.getProduct(productId);
    product.value = response.data;
    if (user.isAuthenticated) {
      const subscriptionStatus = await defaultApi.checkProductRestockSubscription(productId);
      isSubscribed.value = subscriptionStatus.data.isSubscribed;
      const priceChangeSubscriptionStatus = await defaultApi.checkProductPriceChangeSubscription(productId);
      isPriceChangeSubscribed.value = priceChangeSubscriptionStatus.data.isSubscribed;
    }
  } catch (error) {
    console.error('Failed to fetch product details:', error)
  } finally {
    isLoading.value = false
  }
  cart.init()
})

const showMessage = (key: string) => {
  messageText.value = t(`app.cart.${key}`)
  messageVisible.value = true
  setTimeout(() => {
    messageVisible.value = false
  }, 3000)
}

const addToCart = () => {
  if (product.value) {
    cart.addToCart(product.value)
    showMessage('productAdded')
  }
};

const subscribeToRestock = async () => {
  if (product.value) {
    try {
      await defaultApi.subscribeToProductRestock(product.value.id);
      toast({
        title: t('app.products.subscribeSuccess'),
        description: t('app.products.subscribeMessage'),
        duration: 3000,
      });
    } catch (error) {
      console.error('Failed to subscribe to restock notification:', error);
      toast({
        title: t('app.products.subscribeError'),
        description: t('app.products.subscribeErrorMessage'),
        variant: "destructive",
        duration: 3000,
      });
    }
  }
};
const toggleRestockSubscription = async () => {
  if (!product.value) return;

  try {
    if (isSubscribed.value) {
      await defaultApi.unsubscribeFromProductRestock(product.value.id);
      isSubscribed.value = false;
      toast({
        title: t('app.products.unsubscribeSuccess'),
        description: t('app.products.unsubscribeMessage'),
        duration: 3000,
      });
    } else {
      await defaultApi.subscribeToProductRestock(product.value.id);
      isSubscribed.value = true;
      toast({
        title: t('app.products.subscribeSuccess'),
        description: t('app.products.subscribeMessage'),
        duration: 3000,
      });
    }
  } catch (error) {
    console.error('Failed to toggle restock subscription:', error);
    toast({
      title: t('app.products.subscribeError'),
      description: t('app.products.subscribeErrorMessage'),
      variant: "destructive",
      duration: 3000,
    });
  }
};

const togglePriceChangeSubscription = async () => {
  if (!product.value) return;

  try {
    if (isPriceChangeSubscribed.value) {
      await defaultApi.unsubscribeFromProductPriceChange(product.value.id);
      isPriceChangeSubscribed.value = false;
      toast({
        title: t('app.products.unsubscribePriceChangeSuccess'),
        description: t('app.products.unsubscribePriceChangeMessage'),
        duration: 3000,
      });
    } else {
      await defaultApi.subscribeToProductPriceChange(product.value.id);
      isPriceChangeSubscribed.value = true;
      toast({
        title: t('app.products.subscribePriceChangeSuccess'),
        description: t('app.products.subscribePriceChangeMessage'),
        duration: 3000,
      });
    }
  } catch (error) {
    console.error('Failed to toggle price change subscription:', error);
    toast({
      title: t('app.products.subscribePriceChangeError'),
      description: t('app.products.subscribePriceChangeErrorMessage'),
      variant: "destructive",
      duration: 3000,
    });
  }
};
</script>

<style scoped>
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
.product-details-container {
  display: flex;
  flex-direction: row;
  align-items: start;
  gap: 20px;
  padding: 20px;
  background: #fff;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.product-image-detail {
  width: 300px;
  height: 300px;
  object-fit: cover;
  border-radius: 5px;
}

.product-details {
  flex: 1;
  text-align: left;
}

.product-title {
  margin-bottom: 0.5rem;
  font-size: 2em;
  color: #2c3e50;
  font-weight: bold;
}

.product-category {
  font-size: 1.2em;
  color: #3949ab;
  margin-top: 0.8rem;
  margin-bottom: 0.8rem;
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
  color: #3949ab;
  font-weight: bold;
}

.product-stock {
  font-size: 1em;
  padding: 5px 10px;
  border-radius: 5px;
}

.in-stock {
  color: #27ae60;
  background-color: #ecf9f1;
}

.out-of-stock {
  color: #c0392b;
  background-color: #fef6f6;
}

.add-to-cart-detail {
  padding: 10px 20px;
  background-color: #ffffff;
  border: 2px solid #3949ab;
  border-radius: 5px;
  color: #3949ab;
  cursor: pointer;
  transition:
    background-color 0.3s,
    color 0.3s;
  font-size: 1em;
  display: inline-flex;
  align-items: center;
}

.add-to-cart-detail:hover {
  background-color: #3949ab;
  color: #ffffff;
}

.add-to-cart-detail:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading,
.no-product {
  text-align: center;
  font-size: 1.2em;
  color: #7f8c8d;
}

.subscribe-button {
  padding: 10px 20px;
  background-color: #3498db;
  border: none;
  border-radius: 5px;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 1em;
  display: inline-flex;
  align-items: center;
}

.subscribe-button:hover {
  background-color: #2980b9;
}

.subscribe-button.subscribed {
  background-color: #e74c3c;
}

.subscribe-button.subscribed:hover {
  background-color: #c0392b;
}
</style>
