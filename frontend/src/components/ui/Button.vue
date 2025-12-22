<template>
  <button
    :class="[
      'px-4 py-2 rounded-lg font-medium transition-colors duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      variantClasses[variant],
      disabled && 'opacity-50 cursor-not-allowed',
      className,
    ]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  disabled?: boolean
  className?: string
}

const { variant = 'primary', disabled = false, className = '' } = defineProps<Props>()

defineEmits<{
  click: [event: MouseEvent]
}>()

const variantClasses: Record<string, string> = {
  primary: 'bg-[#86BC25] text-black hover:bg-[#6AA81E] focus:ring-[#86BC25] active:bg-[#5A8F19]',
  secondary:
    'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:bg-red-800',
  ghost:
    'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800',
}
</script>
