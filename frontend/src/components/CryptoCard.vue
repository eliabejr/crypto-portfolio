<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 cursor-pointer border border-gray-200 dark:border-gray-700"
    @click="handleClick">
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center space-x-3">
        <img :src="crypto.image" :alt="crypto.name" class="w-12 h-12 rounded-full" @error="handleImageError" />
        <div>
          <h3 class="font-semibold text-lg text-gray-900 dark:text-gray-100">
            {{ crypto.name }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 uppercase">
            {{ crypto.symbol }}
          </p>
        </div>
      </div>
      <button v-if="showWatchlistButton"
        class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        :aria-label="isInWatchlist ? 'Remover da watchlist' : 'Adicionar à watchlist'" @click.stop="toggleWatchlist">
        <svg v-if="isInWatchlist" class="w-5 h-5 text-yellow-500 fill-current" fill="none" stroke="currentColor"
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
        <svg v-else class="w-5 h-5 text-gray-400 hover:text-yellow-500 transition-colors" fill="none"
          stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      </button>
    </div>

    <div class="space-y-2">
      <div class="flex items-baseline justify-between">
        <span class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          ${{ formatPrice(crypto.current_price) }}
        </span>
        <span :class="[
          'text-sm font-medium px-2 py-1 rounded',
          crypto.price_change_percentage_24h >= 0
            ? 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300'
            : 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300',
        ]">
          {{ formatPercentage(crypto.price_change_percentage_24h) }}
        </span>
      </div>

      <div class="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
        <div>
          <span class="font-medium">Market Cap:</span>
          <p class="text-gray-900 dark:text-gray-100">
            ${{ formatLargeNumber(crypto.market_cap) }}
          </p>
        </div>
        <div>
          <span class="font-medium">Rank:</span>
          <p class="text-gray-900 dark:text-gray-100">#{{ crypto.market_cap_rank }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { CryptoCurrency } from '../types/crypto'
import { cryptoService } from '../services/cryptoService'

interface Props {
  crypto: CryptoCurrency
  showWatchlistButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showWatchlistButton: true,
})

const router = useRouter()

const isInWatchlist = computed(() => cryptoService.isInWatchlist(props.crypto.id))

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

const handleClick = () => {
  router.push(`/items/${props.crypto.id}`)
}

const toggleWatchlist = () => {
  if (isInWatchlist.value) {
    cryptoService.removeFromWatchlist(props.crypto.id)
  } else {
    cryptoService.addToWatchlist(props.crypto.id)
  }
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = 'https://via.placeholder.com/48?text=' + props.crypto.symbol.substring(0, 2)
}
</script>
