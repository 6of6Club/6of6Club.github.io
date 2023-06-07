<script setup>
import { ref, watch, onMounted, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { useCryptoStore } from "../stores/eth.js";

const cryptoStore = useCryptoStore();
const { opensea, blur, contract, tokensOfOwner } = cryptoStore;
const { account, loading, last, tokens } = storeToRefs(cryptoStore);

const route = useRoute();

const hash = ref(route.params.hash);
const page = ref(1);

const id = (token) => token.name.split("#")[1];
const lost = (token) => token.attributes[1].value != "🔴";

watchEffect(async () => {
  await tokensOfOwner(`0x${hash.value}`, page.value);
});

watch(tokens, (tokens) => {
  // console.log("tokens", tokens);
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
                  v-if="opensea !== ''"
                  :href="`${opensea}${contract}/${id(token)}`"
                  target="_blank"
                  className="btn btn-info btn-block btn-sm"
                  >{{ account === `0x${hash}` ? "Sell" : "Buy" }} on OpenSea</a
                >
                <div v-if="blur !== ''" class="divider divider-vertical">
                  OR
                </div>
                <a
                  v-if="blur !== ''"
                  :href="`${blur}${contract}/${id(token)}`"
                  target="_blank"
                  className="btn btn-warning btn-block btn-sm"
                  >{{ account === `0x${hash}` ? "Sell" : "Buy" }} on Blur</a
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
