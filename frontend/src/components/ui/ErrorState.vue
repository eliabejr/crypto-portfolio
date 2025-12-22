<template>
  <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div class="mb-4 text-red-500">
      <svg class="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
      {{ title }}
    </h3>
    <p class="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-4">
      {{ message }}
    </p>
    <Button v-if="showRetry" @click="$emit('retry')" variant="primary">
      Tentar novamente
    </Button>
  </div>
</template>

<script setup lang="ts">
import Button from './Button.vue'

interface Props {
  title?: string
  message?: string
  showRetry?: boolean
}

withDefaults(defineProps<Props>(), {
  title: 'Algo deu errado',
  message: 'Ocorreu um erro ao carregar os dados. Por favor, tente novamente.',
  showRetry: true,
})

defineEmits<{
  retry: []
}>()
</script>
