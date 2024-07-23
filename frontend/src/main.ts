import './assets/main.css'

import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primeicons/primeicons.css'
import ToastService from 'primevue/toastservice'

import { createApp } from 'vue'
import { setupI18n } from './i18n'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(PrimeVue)
app.use(ToastService)
app.use(router)

const i18n = setupI18n()
app.use(i18n)

app.mount('#app')