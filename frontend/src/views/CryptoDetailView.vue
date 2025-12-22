<template>
  <div class="w-full">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <Button variant="ghost" class="mb-6 -ml-2" @click="$router.back()">
        <svg class="w-4 h-4 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Voltar
      </Button>

      <div v-if="isLoading" class="text-center py-16">
        <Loader size="lg" />
        <p class="mt-4 text-gray-500 dark:text-gray-400">Carregando informações...</p>
      </div>

      <div v-else-if="isError"
        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3 flex-1">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
              Erro ao carregar criptomoeda
            </h3>
            <p class="text-sm text-red-700 dark:text-red-300 mb-4">
              {{ error?.message || 'Não foi possível carregar as informações.' }}
            </p>
            <Button @click="retry">Tentar novamente</Button>
          </div>
        </div>
      </div>

      <div v-else-if="crypto"
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="px-8 pt-8 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-start justify-between">
            <div class="flex items-center space-x-5">
              <img :src="crypto.image" :alt="crypto.name"
                class="w-20 h-20 rounded-full ring-4 ring-gray-100 dark:ring-gray-700" @error="handleImageError" />
              <div>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {{ crypto.name }}
                </h1>
                <p class="text-lg font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {{ crypto.symbol }}
                </p>
              </div>
            </div>
            <button :class="[
              'p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#86BC25] focus:ring-offset-2',
              isAnimating ? 'star-animate' : '',
            ]" :aria-label="localIsInWatchlist ? 'Remover da watchlist' : 'Adicionar à watchlist'"
              @click="toggleWatchlist">
              <svg v-if="localIsInWatchlist" :class="[
                'w-6 h-6 text-yellow-500 fill-current transition-all duration-300',
                isAnimating ? 'scale-125' : 'scale-100',
              ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <svg v-else :class="[
                'w-6 h-6 text-gray-400 hover:text-yellow-500 transition-all duration-300',
                isAnimating ? 'scale-125' : 'scale-100',
              ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>
          </div>
        </div>

        <div class="px-8 py-6 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-baseline space-x-4">
            <span class="text-5xl font-bold text-gray-900 dark:text-gray-100">
              ${{ formatPrice(crypto.current_price) }}
            </span>
            <span :class="[
              'text-xl font-semibold px-4 py-2 rounded-lg',
              crypto.price_change_percentage_24h >= 0
                ? 'text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-300'
                : 'text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-300',
            ]">
              {{ formatPercentage(crypto.price_change_percentage_24h) }}
            </span>
          </div>
        </div>

        <div class="px-8 py-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                Market Cap
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                ${{ formatLargeNumber(crypto.market_cap) }}
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                Rank
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                #{{ crypto.market_cap_rank }}
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                Volume 24h
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                ${{ formatLargeNumber(crypto.total_volume) }}
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                Circulating Supply
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {{ formatLargeNumber(crypto.circulating_supply) }}
                <span class="text-lg text-gray-500 dark:text-gray-400 uppercase">
                  {{ crypto.symbol }}
                </span>
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Variação 24h
              </h3>
              <div class="space-y-3">
                <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <span class="text-gray-600 dark:text-gray-400 font-medium">Alta 24h</span>
                  <span class="text-gray-900 dark:text-gray-100 font-semibold">
                    ${{ formatPrice(crypto.high_24h) }}
                  </span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <span class="text-gray-600 dark:text-gray-400 font-medium">Baixa 24h</span>
                  <span class="text-gray-900 dark:text-gray-100 font-semibold">
                    ${{ formatPrice(crypto.low_24h) }}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Recordes</h3>
              <div class="space-y-3">
                <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <span class="text-gray-600 dark:text-gray-400 font-medium">All-Time High</span>
                  <span class="text-gray-900 dark:text-gray-100 font-semibold">
                    ${{ formatPrice(crypto.ath) }}
                  </span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <span class="text-gray-600 dark:text-gray-400 font-medium">All-Time Low</span>
                  <span class="text-gray-900 dark:text-gray-100 font-semibold">
                    ${{ formatPrice(crypto.atl) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useFetch } from '../composables/useFetch'
import { cryptoService } from '../services/cryptoService'
import { favoritesApi } from '../modules/favorites/api/favorites.api'
import Button from '../components/ui/Button.vue'
import Loader from '../components/ui/Loader.vue'
import type { CryptoCurrency } from '../types/crypto'

const route = useRoute()
const cryptoId = route.params.id as string

const {
  data: crypto,
  isLoading,
  isError,
  error,
  execute: retry,
} = useFetch<CryptoCurrency | null>(() => cryptoService.getCryptoById(cryptoId))

const localIsInWatchlist = ref(false)
const isAnimating = ref(false)

const updateLocalState = () => {
  if (crypto.value) {
    localIsInWatchlist.value = cryptoService.isInWatchlist(crypto.value.id)
  }
}

watch(crypto, () => {
  updateLocalState()
}, { immediate: true })

onMounted(() => {
  updateLocalState()
  if (typeof window !== 'undefined') {
    window.addEventListener('watchlist-changed', updateLocalState)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('watchlist-changed', updateLocalState)
  }
})

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

const formatPercentage = (value: number): string => {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

const formatLargeNumber = (value: number): string => {
  if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`
  if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`
  return value.toFixed(2)
}

const toggleWatchlist = async () => {
  if (!crypto.value) return

  isAnimating.value = true
  const previousState = localIsInWatchlist.value
  localIsInWatchlist.value = !previousState

  if (previousState) {
    cryptoService.removeFromWatchlist(crypto.value.id)
  } else {
    cryptoService.addToWatchlist(crypto.value.id)
  }

  try {
    await favoritesApi.toggleFavorite(crypto.value.id)
  } catch (error) {
    localIsInWatchlist.value = previousState
    if (previousState) {
      cryptoService.addToWatchlist(crypto.value.id)
    } else {
      cryptoService.removeFromWatchlist(crypto.value.id)
    }
    console.error('[toggleWatchlist]', error)
  }

  setTimeout(() => {
    isAnimating.value = false
  }, 300)
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  if (crypto.value) {
    target.src = 'https://via.placeholder.com/64?text=' + crypto.value.symbol.substring(0, 2)
  }
}
</script>

<style scoped>
.star-animate {
  animation: starPop 0.3s ease-out;
}

@keyframes starPop {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.3);
  }

  100% {
    transform: scale(1);
  }
}
</style>
