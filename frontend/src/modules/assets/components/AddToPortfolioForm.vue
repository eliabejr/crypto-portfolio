<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
      Adicionar ao Portfólio
    </h3>
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div>
        <label
          for="quantity"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Quantidade
        </label>
        <Input
          id="quantity"
          v-model="quantity"
          type="number"
          placeholder="0.00"
          :disabled="isSubmitting"
          step="0.00000001"
          min="0"
        />
      </div>
      <div>
        <label
          for="avgPrice"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Preço Médio (USD)
        </label>
        <Input
          id="avgPrice"
          v-model="avgPrice"
          type="number"
          placeholder="0.00"
          :disabled="isSubmitting"
          step="0.01"
          min="0"
        />
      </div>
      <Button type="submit" :disabled="isSubmitting || !isValid" class="w-full">
        {{ isSubmitting ? 'Adicionando...' : 'Adicionar' }}
      </Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Input from '../../../components/ui/Input.vue'
import Button from '../../../components/ui/Button.vue'

defineProps<{
  assetId: string
}>()

const quantity = ref('')
const avgPrice = ref('')
const isSubmitting = ref(false)

const isValid = computed(() => {
  const qty = parseFloat(quantity.value)
  const price = parseFloat(avgPrice.value)
  return !isNaN(qty) && qty > 0 && !isNaN(price) && price > 0
})

const emit = defineEmits<{
  submit: [data: { quantity: number; avgPrice: number }]
}>()

const handleSubmit = async () => {
  if (!isValid.value || isSubmitting.value) return

  isSubmitting.value = true
  try {
    emit('submit', {
      quantity: parseFloat(quantity.value),
      avgPrice: parseFloat(avgPrice.value),
    })
    quantity.value = ''
    avgPrice.value = ''
  } finally {
    isSubmitting.value = false
  }
}
</script>
