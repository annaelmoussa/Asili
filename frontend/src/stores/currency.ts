import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const useCurrencyStore = defineStore('currency', () => {
  const savedCurrency = localStorage.getItem('currency') || 'USD'
  const currency = ref(savedCurrency)

  const exchangeRates: { [key: string]: number } = {
    EUR: 1
  }

  function setCurrency(newCurrency: string) {
    currency.value = newCurrency
  }

  const formattedPrice = (price: number) => {
    const convertedPrice = price * exchangeRates[currency.value]
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.value
    }).format(convertedPrice)
  }

  watch(currency, (newCurrency) => {
    localStorage.setItem('currency', newCurrency)
  })

  return { currency, setCurrency, formattedPrice }
})
