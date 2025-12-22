<template>
  <div class="relative">
    <Input :model-value="modelValue" placeholder="Buscar ativos..." class="pl-10"
      @update:model-value="$emit('update:modelValue', $event)" @enter="$emit('search')" />
    <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import Input from '../../../components/ui/Input.vue'

defineProps<{
  modelValue: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
  search: []
}>()
</script>
