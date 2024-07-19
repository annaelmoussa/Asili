<template>
  <div class="payment-success">
    <h1>{{ $t('app.payment.successTitle') }}</h1>
    <p>{{ $t('app.payment.successMessage') }}</p>
    <router-link to="/">{{ $t('app.payment.backToHome') }}</router-link>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<style scoped>
.payment-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  background: black;
  color: #fff;
  text-align: center;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.payment-success h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.payment-success p {
  font-size: 1.25rem;
  margin-bottom: 30px;
}

.payment-success a {
  display: inline-block;
  padding: 10px 20px;
  background: #fff;
  color: #6e8efb;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 4px;
  text-decoration: none;
  transition: background 0.3s, color 0.3s;
}

.payment-success a:hover {
  background: #6e8efb;
  color: #fff;
}
</style>