import { createApp } from 'vue'
import App from './App.vue'
import router from './router'      // <-- import your router
import { createPinia } from 'pinia' // <-- import Pinia

import './style.css' // your global CSS

const app = createApp(App)

app.use(createPinia()) // <-- enable Pinia
app.use(router)        // <-- enable Vue Router

app.mount('#app')
