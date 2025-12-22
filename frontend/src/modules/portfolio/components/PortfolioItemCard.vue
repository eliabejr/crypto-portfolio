<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
    <div class="flex items-start justify-between">
      <div class="flex items-center gap-3 flex-1">
        <img :src="item.asset.image" :alt="item.asset.name" class="h-12 w-12 rounded-full flex-shrink-0"
          @error="handleImageError" />
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <h3 class="font-semibold text-gray-900 dark:text-gray-100">
              {{ item.asset.symbol }}
            </h3>
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ item.asset.name }}
            </span>
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Quantidade: {{ formatNumber(item.quantity) }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Preço Médio: ${{ formatNumber(item.avgPrice) }}
          </div>
        </div>
      </div>
      <div class="text-right ml-4">
        <div v-if="item.totalValue !== undefined" class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          ${{ formatNumber(item.totalValue) }}
        </div>
        <div v-else class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          ${{ formatNumber(item.quantity * item.avgPrice) }}
        </div>
        <button @click="$emit('remove')"
          class="mt-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
          Remover
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PortfolioItem } from '../types'

defineProps<{
  item: PortfolioItem
}>()

defineEmits<{
  remove: []
}>()

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  }).format(num)
}

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.src = 'https://via.placeholder.com/48?text=' + (target.alt || '?')
}
</script>
