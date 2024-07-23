import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'

export const useLanguageStore = defineStore('language', () => {
  const { locale } = useI18n()
  const savedLanguage = localStorage.getItem('language') || 'fr'
  const language = ref(savedLanguage)

  function setLanguage(newLanguage: string) {
    language.value = newLanguage
    locale.value = newLanguage
  }

  watch(language, (newLanguage) => {
    localStorage.setItem('language', newLanguage)
  })

  setLanguage(savedLanguage)

  return { language, setLanguage }
})