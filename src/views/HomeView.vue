<script setup>
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useCryptoStore } from "../stores/eth.js";

const cryptoStore = useCryptoStore();
const { connect, mint } = cryptoStore;
const { account } = storeToRefs(cryptoStore);

onMounted(async () => {
  await connect(true);
});

const quantity = ref(64);

const loading = ref(false);

const win = ref("win.svg");
const lose = ref("lose.svg");
const plus = ref("plus.svg");

const forceRerender = () => {
  [win, lose, plus].forEach((e) => {
    e.value = e.value.split("?")[0] + "?d=" + new Date().getMilliseconds();
  });
};

setInterval(() => {
  forceRerender();
}, 10_000);
</script>

<template>
  <div class="container mx-auto">
    <div class="hero min-h-screen">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold">6of6 Club</h1>
          <p class="py-6 text-center">Dynamic on-chain NFTs</p>
          <button
            class="btn btn-primary"
            v-if="account === null"
            @click="
              async () => {
                loading = true;
                await connect();
                loading = false;
              }
            "
          >
            <span v-if="loading" class="loading loading-spinner"></span>
            connect and mint
          </button>
          <div v-else class="form-control">
            <div class="input-group">
              <input
                v-model="quantity"
                type="text"
                placeholder="1 - 64"
                class="input input-bordered"
              />
              <button
                class="btn btn-primary"
                @click="
                  async () => {
                    loading = true;
                    await mint(quantity);
                    setTimeout(() => {
                      loading = false;
                    }, 30000);
                  }
                "
              >
                <span v-if="loading" class="loading loading-spinner"></span>
                free mint
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="hero min-h-screen">
      <div class="hero-content flex-col w-full lg:flex-row">
        <div>
          <img :src="plus" class="max-w-sm w-96" />
        </div>
        <div class="w-full">
          <div class="py-6 text-center">
            <ul class="steps steps-vertical">
              <li data-content="" class="step">
                Mint NFT - one of 65,536 different token variants will be
                generated
              </li>
              <li data-content="" class="step">
                <ul>
                  <li data-content="" class="step step-success">
                    NFT Success - empty chamber stop at the top
                  </li>
                  <li data-content="" class="step step-error">
                    NFT Wasted - cartridge stops at the top
                  </li>
                </ul>
              </li>
              <li data-content="" class="step">
                Sell NFT - only opensea marketplace are supported
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="hero min-h-screen">
      <div class="hero-content flex-col w-full lg:flex-row">
        <div>
          <img :src="lose" class="max-w-sm w-96" />
        </div>
        <div class="w-full">
          <div class="py-6 text-center">
            <ul class="steps steps-vertical">
              <li data-content="" class="step">
                Buy NFT - plus one cartridge will be added and re-spun will
                start
              </li>
              <li data-content="" class="step">
                <ul>
                  <li data-content="" class="step step-success">
                    NFT Success - selling NFT will add a new cartridge
                  </li>
                  <li data-content="" class="step step-error">
                    NFT Wasted - no more cartridges will be added to the NFT
                  </li>
                </ul>
              </li>
              <li data-content="" class="step">
                Sell NFT - until there are 6of6 cartridges in the drum
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="hero min-h-screen">
      <div class="hero-content flex-col w-full lg:flex-row">
        <div>
          <img :src="win" class="max-w-sm w-96" />
        </div>
        <div class="w-full">
          <div class="py-6 text-center">
            <ul class="steps steps-vertical">
              <li data-content="" class="step">
                NFT 6of6 is very rare, the chance is 1 in 65
              </li>
              <li data-content="" class="step">
                Users who collect 6 of 6 - become members of the 6of6 Club
              </li>
              <li data-content="" class="step">
                6of6 Club members will be in future airdrops (SS2ERC721)
              </li>
              <li data-content="" class="step">
                NFT and metadata are generated by on-chain
              </li>
              <li data-content="" class="step">
                Only selling (not transfer) for ETH adds a cartridge
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="hero min-h-screen">
      <div class="columns-1 lg:columns-5">
        <div class="text-center">
          <img src="/2.svg" />
          <div
            class="radial-progress text-primary-content border-4 border-primary my-10"
            style="--value: 83.3"
          >
            83.3%
          </div>
          <div class="text-lg bg-inherit border-0">54,000 NFTs</div>
        </div>
        <div class="text-center">
          <img src="/3.svg" />
          <div
            class="radial-progress text-primary-content border-4 border-primary my-10"
            style="--value: 66.6"
          >
            66.6%
          </div>
          <div class="text-xl bg-inherit border-0">36,000 NFTs</div>
        </div>
        <div class="text-center">
          <img src="/4.svg" />
          <div
            class="radial-progress text-primary-content border-4 border-primary my-10"
            style="--value: 50"
          >
            50.0%
          </div>
          <div class="text-2xl bg-inherit border-0">18,000 NFTs</div>
        </div>
        <div class="text-center">
          <img src="/5.svg" />
          <div
            class="radial-progress text-primary-content border-4 border-primary my-10"
            style="--value: 33.3"
          >
            33.3%
          </div>
          <div class="text-3xl bg-inherit border-0">06,000 NFTs</div>
        </div>
        <div class="text-center">
          <img src="/6.svg" />
          <div
            class="radial-progress text-primary-content border-4 border-primary my-10"
            style="--value: 16.6"
          >
            16.6%
          </div>
          <div class="text-4xl bg-inherit border-0">01,000 NFTs</div>
        </div>
      </div>
    </div>
  </div>
</template>
