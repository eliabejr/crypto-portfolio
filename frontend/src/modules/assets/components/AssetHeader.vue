<template>
  <div class="flex items-center gap-4">
    <img
      :src="asset.image"
      :alt="asset.name"
      class="h-16 w-16 rounded-full"
      @error="handleImageError"
    />
    <div class="flex-1">
      <div class="flex items-center gap-2 mb-1">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {{ asset.symbol }}
        </h1>
        <span
          :class="[
            'px-2 py-1 text-xs rounded-full',
            asset.status === 'active'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
          ]"
        >
          {{ asset.status === 'active' ? 'Ativo' : 'Inativo' }}
        </span>
      </div>
      <p class="text-gray-600 dark:text-gray-400">{{ asset.name }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Asset } from '../types'

defineProps<{
  asset: Asset
}>()

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.src = 'https://via.placeholder.com/64?text=' + (target.alt || '?')
}
</script>
