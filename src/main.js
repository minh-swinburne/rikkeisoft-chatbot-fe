// import '@/assets/main.css'

import { Quasar } from 'quasar'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from '@/App.vue'
import router from '@/plugins/router'
import quasarOptions from '@/plugins/quasar'
import vue3GoogleLogin from 'vue3-google-login'
import googleConfig from '@/plugins/sso/googleConfig'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(Quasar, quasarOptions)
app.use(vue3GoogleLogin, googleConfig)

app.mount('#app')
