import './assets/main.css'

import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import i18n from './i18n'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(PrimeVue)
app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')
