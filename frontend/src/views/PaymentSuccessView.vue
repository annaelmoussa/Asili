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