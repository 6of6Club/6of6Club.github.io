<script setup>
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useCryptoStore } from "./stores/eth.js";

const cryptoStore = useCryptoStore();
const { contract, connect, disconnect } = cryptoStore;
const { account } = storeToRefs(cryptoStore);

onMounted(async () => {
  await connect(true);
});
</script>

<template>
  <div class="container max-width px-1">
    <div class="navbar relative z-10">
      <div class="flex-1">
        <router-link to="/">
          <img src="/logo.svg" class="w-10" />
        </router-link>
      </div>
      <div class="flex-none">
        <button
          class="btn btn-primary"
          v-if="account === null"
          @click="connect"
        >
          connect
        </button>
        <div v-else>
          <div class="dropdown dropdown-end">
            <label tabindex="0" class="btn btn-ghost btn-circle">
              <div class="indicator">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </label>
            <ul
              tabindex="0"
              class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 truncate"
            >
              <li class="disabled">
                <span class="justify-between">
                  {{ account.substring(0, 10) }}...{{
                    account.substring(account.length - 9)
                  }}
                </span>
              </li>
              <li>
                <router-link :to="`/${account}`" class="justify-between">
                  My 6of6 NFTs
                </router-link>
              </li>
              <li>
                <a
                  :href="`https://opensea.io/assets/ethereum/${contract}`"
                  class="justify-between"
                  target="_blank"
                >
                  6of6 on Opensea</a
                >
              </li>
              <li>
                <a
                  :href="`https://blur.io/collection/${contract}`"
                  class="justify-between"
                  target="_blank"
                >
                  6of6 on Blur</a
                >
              </li>
              <li><button @click="disconnect">Logout</button></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col min-h-screen justify-center items-center -mt-16">
      <router-view></router-view>
      <div class="container mx-auto">
        <div class="hero">
          <footer class="footer footer-center p-10 text-base-content">
            <div class="grid grid-flow-col gap-4">
              <router-link to="/" class="link link-hover">Home</router-link>
              <router-link to="/about-us" class="link link-hover"
                >About us</router-link
              >
              <router-link to="/contact" class="link link-hover"
                >Contact</router-link
              >
              <router-link to="/faq" class="link link-hover">FAQ</router-link>
            </div>
            <div>
              <div class="grid grid-flow-col gap-4">
                <a
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    class="fill-current"
                  >
                    <path
                      d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
                    ></path></svg
                ></a>
                <a
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    class="fill-current"
                  >
                    <path
                      d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"
                    ></path></svg
                ></a>
                <a
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    class="fill-current"
                  >
                    <path
                      d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"
                    ></path></svg
                ></a>
              </div>
            </div>
            <div>
              <p>Copyright © 2023 - RockArt 🪨 AI</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css?family=Gruppo");

html,
body {
  font-family: "Gruppo", sans-serif;
}

#app {
  font-family: "Gruppo", sans-serif;
}
</style>
