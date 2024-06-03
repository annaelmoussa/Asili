import './assets/main.css'

import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/saga-blue/theme.css' // Thème choisi
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(PrimeVue)
app.use(createPinia())
app.use(router)

app.mount('#app')
