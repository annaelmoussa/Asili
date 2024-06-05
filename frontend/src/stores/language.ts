import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const useLanguageStore = defineStore('language', () => {
  const savedLanguage = localStorage.getItem('language') || 'en'
  const language = ref(savedLanguage)

  function setLanguage(newLanguage: string) {
    language.value = newLanguage
  }

  watch(language, (newLanguage) => {
    localStorage.setItem('language', newLanguage)
  })

  return { language, setLanguage }
})
