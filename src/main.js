import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './style.css'  // 鍙繚鐣欏叏灞€鏍峰紡

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')