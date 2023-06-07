import { ref } from "vue";
import { createPublicClient, createWalletClient, http, custom } from "viem";
import { foundry, polygonMumbai } from "viem/chains";
import { acceptHMRUpdate, defineStore } from "pinia";

import { useRouter } from "vue-router";

/*
  Foundry
  "address": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  "multicall": "0x5FbDB2315678afecb367f032d93F642f64180aa3",

  Polygon
  "address": "0x6339d6fdF06c782046cc4DB7a61BEf1bB8542E58",
  "multicall": "0xcA11bde05977b3631167028862bE2a173976CA11",
*/

import {
  EthereumProvider,
  REQUIRED_METHODS,
} from "@walletconnect/ethereum-provider";

import contractConfig from "@/artifacts/config.json";

export const useCryptoStore = defineStore("eth", () => {
  const chain = contractConfig.chain == "foundry" ? foundry : polygonMumbai;

  const loading = ref(false);
  const last = ref(false);
  const account = ref(null);
  const token = ref({});
  const tokens = ref([]);
  const transactionHash = ref("");

  const router = useRouter();

  const publicClient = ref(
    createPublicClient({
      chain,
      batch: {
        multicall: true,
      },
      transport: http(),
    })
  );

  const walletClient = ref(
    window && window.ethereum
      ? createWalletClient({
          chain,
          transport: custom(window.ethereum),
        })
      : null
  );

  async function connect(check) {
    if (typeof check === "boolean") {
      if (walletClient && walletClient.value) {
        const [address] = await walletClient.value.getAddresses();
        if (address) {
          const id = await walletClient.value.getChainId();
          if (chain.id === id) {
            account.value = address;
          }
        }
      }
    } else {
      try {
        if (window && window.ethereum) {
          const id = await walletClient.value.getChainId();
          if (chain.id != id) {
            await walletClient.value.addChain({ chain });
            await walletClient.value.switchChain(chain);
          }

          const [address] = await walletClient.value.requestAddresses();
          if (address) {
            account.value = address;
          }
        } else {
          const projectId = "2d370def4cd33b8cdc388ee6f5511aae";

          const provider = await EthereumProvider.init({
            projectId,
            chains: [chain.id],
            showQrModal: true,
            methods: REQUIRED_METHODS,
            rpcMap: {
              [chain.id]: chain.rpcUrls.default.http,
            },
          });

          walletClient.value = createWalletClient({
            chain,
            transport: custom(provider),
          });

          await provider.connect();

          const [address] = await walletClient.value.getAddresses();
          if (address) {
            account.value = address;
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function disconnect() {
    account.value = null;
  }

  async function get(functionName, tokenId, limit = 128) {
    if (!tokenId) return;

    setLoader(true);

    try {
      const { ethereum } = window;

      if (ethereum) {
        const id = typeof tokenId === "bigint" ? tokenId : BigInt(tokenId);
        const l = typeof limit === "bigint" ? limit : BigInt(limit);

        const contracts = [];
        for (let i = id; i < id + l; i++) {
          contracts.push({
            address: contractConfig.address,
            abi: contractConfig.abi,
            functionName: functionName,
            args: [i],
          });
        }

        const result = await publicClient.value.multicall({
          contracts,
          multicallAddress: contractConfig.multicall,
        });

        tokens.value = [];
        result
          .filter((r) => r.status === "success")
          .forEach((r) => {
            if (limit === 1) {
              token.value = JSON.parse(
                r.result.replace("data:application/json;utf8,", "")
              );
            } else {
              tokens.value.push(
                JSON.parse(r.result.replace("data:application/json;utf8,", ""))
              );
            }
          });
      }

      setLoader(false);
    } catch (e) {
      console.error(functionName, e);

      setLoader(false);
    }
  }

  async function tokensOfOwner(owner, page = 1) {
    setLoader(true);

    try {
      const data = await publicClient.value.readContract({
        address: contractConfig.address,
        abi: contractConfig.abi,
        functionName: "tokensOfOwner",
        args: [owner],
      });

      page = page ? parseInt(page) : 1;

      const contracts = [];
      data
        .reverse()
        .slice((page - 1) * 128, page * 128)
        .forEach((id) => {
          contracts.push({
            address: contractConfig.address,
            abi: contractConfig.abi,
            functionName: "tokenURI",
            args: [id],
          });
        });

      last.value = page * 128 < data.length;

      const result = await publicClient.value.multicall({
        contracts,
        multicallAddress: contractConfig.multicall,
      });

      if (page === 1) {
        tokens.value = [];
      }
      result
        .filter((r) => r.status === "success")
        .forEach((r) => {
          tokens.value.push(
            JSON.parse(r.result.replace("data:application/json;utf8,", ""))
          );
        });

      setLoader(false);
    } catch (e) {
      console.error(e);

      setLoader(false);
    }
  }

  async function mint(quantity) {
    setLoader(true);

    try {
      const { ethereum } = window;

      if (ethereum) {
        publicClient.value.watchContractEvent({
          address: contractConfig.address,
          abi: contractConfig.abi,
          eventName: "Transfer",
          onLogs: (logs) => {
            logs.forEach(async (log) => {
              if (log.transactionHash === transactionHash.value) {
                setLoader(false);
                router.push(`/${account.value}`);
              }
            });
          },
        });

        const { request } = await publicClient.value.simulateContract({
          address: contractConfig.address,
          abi: contractConfig.abi,
          functionName: "mint",
          args: [quantity],
          account: account.value,
        });

        transactionHash.value = await walletClient.value.writeContract(request);
      } else {
        console.log("Ethereum object doesn't exist!");

        setLoader(false);
      }
    } catch (e) {
      console.error("mint", e);

      setLoader(false);
    }
  }

  function setLoader(value) {
    loading.value = value;
  }

  return {
    opensea: contractConfig.opensea,
    blur: contractConfig.blur,
    contract: contractConfig.address,
    connect,
    disconnect,
    get, // tokenURI, clubMember
    tokensOfOwner,
    mint,
    account,
    loading,
    last,
    token,
    tokens,
  };
});

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useCryptoStore, import.meta.hot));
