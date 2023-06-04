import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import { createPinia } from "pinia";

import "./style.css";

import App from "./App.vue";
import Home from "./views/HomeView.vue";
import Token from "./views/TokenView.vue";
import User from "./views/UserView.vue";
import AboutUs from "./views/AboutUsView.vue";
import Contact from "./views/ContactView.vue";
import FAQ from "./views/FAQView.vue";

const pinia = createPinia();

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", name: "home", component: Home },
    { path: "/about-us", name: "about-us", component: AboutUs },
    { path: "/contact", name: "contact", component: Contact },
    { path: "/faq", name: "faq", component: FAQ },
    { path: "/:id", name: "token", component: Token },
    { path: "/0x:hash", name: "user", component: User },
  ],
});

createApp(App).use(pinia).use(router).mount("#app");
