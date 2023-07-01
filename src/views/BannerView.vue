<script setup>
import { ref, watch, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { useCryptoStore } from "../stores/eth.js";

const cryptoStore = useCryptoStore();
const { tokensOfOwner } = cryptoStore;
const { tokens } = storeToRefs(cryptoStore);

const route = useRoute();

const hash = ref(route.params.hash);
const page = ref(1);

watchEffect(async () => {
  await tokensOfOwner(`0x${hash.value}`, page.value);
});

watch(tokens, (tokens) => {
  // console.log("tokens", tokens);
});
</script>

<template>
  <div class="min-h-screen">
    <div class="grid grid-cols-3 gap-0 mt-0">
      <div v-for="token in tokens">
        <div className="card">
          <figure className="p-5">
            <img :src="token.image" :alt="token.name" className="rounded-xl" />
          </figure>
        </div>
      </div>
    </div>
  </div>
</template>
