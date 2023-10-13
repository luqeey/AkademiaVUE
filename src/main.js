import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/router.js'

const app = createApp(App)
    .use(router)

router.isReady().then(() => {
    app.mount('#app')
})
