<template>
  <div class="w-full">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-10">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-2">
          Minha Watchlist
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          Criptomoedas que você está acompanhando
        </p>
      </div>

      <div
        v-if="isLoading"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <CryptoCardSkeleton v-for="n in 8" :key="`skeleton-${n}`" />
      </div>

      <div
        v-else-if="isError"
        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6"
      >
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3 flex-1">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
              Erro ao carregar watchlist
            </h3>
            <p class="text-sm text-red-700 dark:text-red-300 mb-4">
              {{ error?.message || 'Não foi possível carregar sua watchlist.' }}
            </p>
            <Button @click="retry">Tentar novamente</Button>
          </div>
        </div>
      </div>

      <div
        v-else-if="isEmpty"
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-12 text-center"
      >
        <svg
          class="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Sua watchlist está vazia
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
          Comece a adicionar criptomoedas à sua watchlist para acompanhá-las de perto
        </p>
        <Button @click="$router.push('/')">Explorar criptomoedas</Button>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <CryptoCard v-for="crypto in watchlistCryptos" :key="crypto.id" :crypto="crypto" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useFetch } from '../composables/useFetch'
import { cryptoService } from '../services/cryptoService'
import CryptoCard from '../components/CryptoCard.vue'
import CryptoCardSkeleton from '../components/CryptoCardSkeleton.vue'
import Button from '../components/ui/Button.vue'
import type { CryptoCurrency } from '../types/crypto'

const {
  data: watchlistCryptos,
  isLoading,
  isError,
  error,
  execute: retry,
} = useFetch<CryptoCurrency[]>(() => cryptoService.getWatchlistCryptos())

const isEmpty = computed(() => {
  return !watchlistCryptos.value || watchlistCryptos.value.length === 0
})

const reloadWatchlist = () => {
  retry()
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', reloadWatchlist)
    window.addEventListener('watchlist-changed', reloadWatchlist)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('storage', reloadWatchlist)
    window.removeEventListener('watchlist-changed', reloadWatchlist)
  }
})
</script>
