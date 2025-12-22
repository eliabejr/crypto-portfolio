<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div
      v-if="asset.current_price"
      class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
    >
      <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">Preço Atual</div>
      <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
        ${{ formatNumber(asset.current_price) }}
      </div>
    </div>
    <div
      v-if="asset.price_change_percentage_24h !== undefined"
      class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
    >
      <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">Variação 24h</div>
      <div
        :class="[
          'text-2xl font-bold',
          asset.price_change_percentage_24h >= 0
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-600 dark:text-red-400',
        ]"
      >
        {{ asset.price_change_percentage_24h >= 0 ? '+' : ''
        }}{{ asset.price_change_percentage_24h.toFixed(2) }}%
      </div>
    </div>
    <div
      v-if="asset.market_cap_rank"
      class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
    >
      <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">Ranking</div>
      <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
        #{{ asset.market_cap_rank }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Asset } from '../types'

defineProps<{
  asset: Asset
}>()

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}
</script>
