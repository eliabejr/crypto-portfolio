<template>
  <div :class="['animate-pulse bg-gray-200 dark:bg-gray-700 rounded', width, height, className]" />
</template>

<script setup lang="ts">
interface Props {
  width?: string
  height?: string
  className?: string
}

withDefaults(defineProps<Props>(), {
  width: 'w-full',
  height: 'h-4',
  className: '',
})
</script>
