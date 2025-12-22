<template>
  <div :class="['flex items-center justify-center', sizeClasses]">
    <div
      class="border-4 border-gray-200 border-t-[#86BC25] rounded-full animate-spin"
      :class="spinnerSize"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  size: 'md',
})

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
}

const spinnerSize = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
}
</script>
