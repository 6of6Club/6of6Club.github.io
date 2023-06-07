<script setup>
import { ref, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { useCryptoStore } from "../stores/eth.js";

const cryptoStore = useCryptoStore();
const { opensea, blur, contract, get } = cryptoStore;
const { loading, token } = storeToRefs(cryptoStore);

const route = useRoute();

const id = ref("");
const lost = ref(true);

watch(
  () => route.params.id,
  async (id) => {
    await get("tokenURI", id);
  }
);

watch(token, (token) => {
  id.value = token && token.name && token.name.split("#")[1];
  lost.value =
    token && token.attributes && token.attributes[1].value === "LOST";
  console.log(token);
});

onMounted(async () => {
  await get("tokenURI", route.params.id);
});
</script>

<template>
  <div v-if="loading || !token.name">Loading</div>
  <div v-else className="card w-96">
    <div className="card-body">
      <h1 className="card-title justify-center">{{ token.name }}</h1>
    </div>
    <figure className="px-10">
      <img :src="token.image" :alt="token.name" className="rounded-xl" />
    </figure>
    <div className="card-body items-center text-center">
      <div className="card-actions">
        <div v-if="!lost">
          <a
            v-if="opensea !== ''"
            :href="`${opensea}${contract}/${id}`"
            target="_blank"
            className="btn btn-info btn-block"
            >Sell on OpenSea</a
          >
          <div v-if="blur !== ''" class="divider divider-vertical">OR</div>
          <a
            v-if="blur !== ''"
            :href="`${blur}${contract}/${id}`"
            target="_blank"
            className="btn btn-warning btn-block"
            >Sell on Blur</a
          >
        </div>
        <div v-else>NFT Wasted</div>
      </div>
    </div>
  </div>
</template>
