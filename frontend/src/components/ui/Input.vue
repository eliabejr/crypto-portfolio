<template>
  <div class="relative">
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="[
        'w-full px-4 py-2 border rounded-lg',
        'focus:outline-none focus:ring-2 focus:ring-[#86BC25] focus:border-transparent',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'bg-white dark:bg-gray-800',
        'border-gray-300 dark:border-gray-600',
        'text-gray-900 dark:text-gray-100',
        'placeholder-gray-400 dark:placeholder-gray-500',
        className,
      ]"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @keyup.enter="$emit('enter', $event)"
    />
    <slot name="icon" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
  type?: string
  placeholder?: string
  disabled?: boolean
  className?: string
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  disabled: false,
  className: '',
})

defineEmits<{
  'update:modelValue': [value: string]
  enter: [event: KeyboardEvent]
}>()
</script>
