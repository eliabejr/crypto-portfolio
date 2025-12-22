<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
    <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Resumo do Portfólio</h2>
    <div class="space-y-2">
      <div class="flex justify-between items-center">
        <span class="text-gray-600 dark:text-gray-400">Total de Ativos</span>
        <span class="font-semibold text-gray-900 dark:text-gray-100">
          {{ items.length }}
        </span>
      </div>
      <div v-if="totalValue !== undefined" class="flex justify-between items-center">
        <span class="text-gray-600 dark:text-gray-400">Valor Total</span>
        <span class="font-semibold text-gray-900 dark:text-gray-100">
          ${{ formatNumber(totalValue) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PortfolioItem } from '../types'

defineProps<{
  items: PortfolioItem[]
  totalValue?: number
}>()

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}
</script>
