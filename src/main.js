import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "@/App.vue";
import router from "@/router";
import vue3GoogleLogin from "vue3-google-login";

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.use(vue3GoogleLogin, {
  clientId:
    "1047088098330-2d17mgbf5bdugkvkh69i0ah65c40hp65.apps.googleusercontent.com",
});

app.mount("#app");
