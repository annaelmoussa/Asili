<template>
  <div class="language-switcher">
    <div class="selectors">
      <div class="selector">
        <img :src="currentFlag" alt="Current Language" class="flag-icon" />
        <select v-model="currentLocale" @change="changeLanguage">
          <option value="en">{{ t('app.language.en') }}</option>
          <option value="fr">{{ t('app.language.fr') }}</option>
        </select>
      </div>
    </div>
    <div class="links">
      <a href="#" @click="goToContact">{{ t('app.contact.cta') }}</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCurrencyStore } from '@/stores/currency'
import { useLanguageStore } from '@/stores/language'
import { useRouter } from "vue-router";

const { locale, t } = useI18n()
const router = useRouter()
const currencyStore = useCurrencyStore()
const languageStore = useLanguageStore()

const currentLocale = ref(languageStore.language)
const currentCurrency = ref(currencyStore.currency)

const flags: Record<string, string> = {
  en: 'https://flagcdn.com/us.svg',
  fr: 'https://flagcdn.com/fr.svg'
}

function goToContact() {
  router.push('contact')
}

const currentFlag = computed(() => flags[currentLocale.value])

onMounted(() => {
  if (currentLocale.value !== locale.value) {
    languageStore.setLanguage(currentLocale.value)
  }
})

const changeLanguage = () => {
  locale.value = currentLocale.value
  languageStore.setLanguage(currentLocale.value)
}

const changeCurrency = () => {
  currencyStore.setCurrency(currentCurrency.value)
}
</script>

<style scoped>
.language-switcher {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.selectors {
  display: flex;
  align-items: center;
}

.selector {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.flag-icon {
  width: 20px;
  margin-right: 10px;
  object-fit: cover;
}

.selector select {
  border: none;
  background: none;
  font-size: 14px;
  color: #333;
}

.selector select:focus {
  outline: none;
}

.links a {
  margin-left: 20px;
  text-decoration: none;
  font-size: 14px;
}

.links a:hover {
  text-decoration: underline;
}
</style>
