import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/router.js'
import axios from 'axios'

const app = createApp(App)
    .use(router)
    .use(axios)

router.isReady().then(() => {
    app.mount('#app')
})
