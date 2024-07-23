import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import fr from './locales/fr.json'

export function setupI18n() {
  const storedLanguage = localStorage.getItem('language') || 'fr'

  return createI18n({
    legacy: false,
    locale: storedLanguage,
    fallbackLocale: 'en',
    messages: {
      en,
      fr
    }
  })
}