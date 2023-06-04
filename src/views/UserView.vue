<script setup>
import { ref, watch, onMounted, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { useCryptoStore } from "../stores/eth.js";

const cryptoStore = useCryptoStore();
const { contract, tokensOfOwner } = cryptoStore;
const { loading, last, tokens } = storeToRefs(cryptoStore);

const route = useRoute();

const hash = ref(route.params.hash);
const page = ref(1);

const id = (token) => token.name.split("#")[1];
const lost = (token) => token.attributes[1].value != "🔴";

watchEffect(async () => {
  console.log("watchEffect", `0x${hash.value}`, page.value);
  await tokensOfOwner(`0x${hash.value}`, page.value);
});

watch(tokens, (tokens) => {
  console.log("tokens", tokens);
});
</script>

<template>
  <div class="min-h-screen">
    <div class="hero min-h-screen" v-if="loading || !tokens || !tokens.length">
      <div class="hero-content text-center">Loading ...</div>
    </div>
    <div v-else class="grid grid-cols-4 gap-4 mt-10">
      <div v-for="token in tokens">
        <div className="card">
          <div className="card-body">
            <h1 className="card-title justify-center">{{ token.name }}</h1>
          </div>
          <figure className="px-1">
            <img :src="token.image" :alt="token.name" className="rounded-xl" />
          </figure>
          <div className="card-body items-center text-center">
            <div v-if="lost(token)" className="card-actions">
              <div>
                <a
                  :href="`https://opensea.io/assets/ethereum/${contract}/${id(
                    token
                  )}`"
                  target="_blank"
                  className="btn btn-info btn-block btn-sm"
                  >Sell on OpenSea</a
                >
                <div class="divider divider-vertical">OR</div>
                <a
                  :href="`https://blur.io/asset/${contract}/${id(token)}`"
                  target="_blank"
                  className="btn btn-warning btn-block btn-sm"
                  >Sell on Blur</a
                >
              </div>
            </div>
            <div v-else>NFT Wasted</div>
          </div>
        </div>
      </div>
    </div>
    <button
      v-if="last"
      class="btn btn-block btn-primary"
      @click="
        () => {
          page++;
        }
      "
    >
      MORE
    </button>
  </div>
</template>
