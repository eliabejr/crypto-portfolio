<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow cursor-pointer"
    @click="$emit('click')"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3 flex-1 min-w-0">
        <img
          :src="asset.image"
          :alt="asset.name"
          class="h-10 w-10 rounded-full flex-shrink-0"
          @error="handleImageError"
        />
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <h3 class="font-semibold text-gray-900 dark:text-gray-100 truncate">
              {{ asset.symbol }}
            </h3>
            <span
              :class="[
                'px-2 py-0.5 text-xs rounded-full',
                asset.status === 'active'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
              ]"
            >
              {{ asset.status === 'active' ? 'Ativo' : 'Inativo' }}
            </span>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
            {{ asset.name }}
          </p>
          <div class="mt-1 flex items-center gap-3 text-sm">
            <span
              v-if="asset.current_price !== undefined"
              class="font-semibold tabular-nums text-gray-900 dark:text-gray-100"
            >
              ${{ formatPrice(asset.current_price) }}
            </span>
            <span
              v-if="asset.price_change_percentage_24h !== undefined"
              :class="[
                'tabular-nums',
                asset.price_change_percentage_24h >= 0
                  ? 'text-green-700 dark:text-green-300'
                  : 'text-red-700 dark:text-red-300',
              ]"
            >
              {{ asset.price_change_percentage_24h >= 0 ? '+' : ''
              }}{{ asset.price_change_percentage_24h.toFixed(2) }}%
            </span>
          </div>
        </div>
      </div>
      <FavoriteButton
        :asset-id="asset.id"
        :is-favorite="isFavorite"
        class="ml-2"
        @toggle="$emit('favorite-toggle')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Asset } from '../types'
import FavoriteButton from './FavoriteButton.vue'

interface Props {
  asset: Asset
  isFavorite?: boolean
}

withDefaults(defineProps<Props>(), {
  isFavorite: false,
})

defineEmits<{
  click: []
  'favorite-toggle': []
}>()

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.src = 'https://via.placeholder.com/40?text=' + (target.alt || '?')
}

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: value < 1 ? 4 : 2,
    maximumFractionDigits: value < 1 ? 8 : 2,
  }).format(value)
}
</script>
