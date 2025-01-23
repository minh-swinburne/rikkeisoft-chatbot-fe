import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "@/App.vue";
import router from "@/plugins/router";
import vue3GoogleLogin from "vue3-google-login";

// Import Quasar CSS and additional styles
import "quasar/dist/quasar.css";
import { Quasar } from 'quasar';
import quasarUserOptions from './quasar-user-options'

const app = createApp(App).use(Quasar, quasarUserOptions)
  .use(Quasar, quasarUserOptions) // Use quasarUserOptions here
  .use(router)
  .use(createPinia())
  .use(vue3GoogleLogin, {
    clientId: "1047088098330-2d17mgbf5bdugkvkh69i0ah65c40hp65.apps.googleusercontent.com",
  });

app.mount("#app");
