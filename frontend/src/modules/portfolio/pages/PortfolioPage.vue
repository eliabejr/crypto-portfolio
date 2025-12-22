<template>
  <AppContainer>
    <div class="py-6 space-y-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Portfolio</h1>
        <p class="text-gray-600 dark:text-gray-400">
          Visualize suas posições em criptoativos
        </p>
      </div>

      <div v-if="isLoading" class="space-y-4">
        <Skeleton width="w-full" height="h-32" />
        <div v-for="i in 3" :key="i"
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div class="flex items-center gap-3">
            <Skeleton width="w-12" height="h-12" className="rounded-full" />
            <div class="flex-1 space-y-2">
              <Skeleton width="w-32" height="h-4" />
              <Skeleton width="w-24" height="h-3" />
            </div>
          </div>
        </div>
      </div>

      <ErrorState v-else-if="error" :message="error.message || 'Erro ao carregar portfólio'" @retry="loadPortfolio" />

      <div v-else-if="portfolio" class="space-y-6">
        <PortfolioSummary :items="portfolio.items" :total-value="portfolio.totalValue" />

        <EmptyState v-if="portfolio.items.length === 0" title="Nenhum ativo no portfólio"
          description="Adicione ativos ao seu portfólio para começar a acompanhar suas posições.">
          <template #action>
            <Button @click="goToAssets" variant="primary" class="mt-4">
              Explorar Assets
            </Button>
          </template>
        </EmptyState>

        <div v-else class="space-y-4">
          <PortfolioItemCard v-for="item in portfolio.items" :key="item.id" :item="item"
            @remove="handleRemove(item.id)" />
        </div>
      </div>
    </div>
  </AppContainer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { portfolioApi } from '../api/portfolio.api'
import type { Portfolio } from '../types'
import AppContainer from '../../../components/layout/AppContainer.vue'
import PortfolioSummary from '../components/PortfolioSummary.vue'
import PortfolioItemCard from '../components/PortfolioItemCard.vue'
import Skeleton from '../../../components/ui/Skeleton.vue'
import EmptyState from '../../../components/ui/EmptyState.vue'
import ErrorState from '../../../components/ui/ErrorState.vue'
import Button from '../../../components/ui/Button.vue'

const router = useRouter()

const portfolio = ref<Portfolio | null>(null)
const isLoading = ref(false)
const error = ref<Error | null>(null)

const loadPortfolio = async () => {
  isLoading.value = true
  error.value = null
  try {
    portfolio.value = await portfolioApi.getPortfolio()
  } catch (err) {
    error.value = err instanceof Error ? err : new Error(String(err))
  } finally {
    isLoading.value = false
  }
}

const handleRemove = async (itemId: string) => {
  if (!confirm('Tem certeza que deseja remover este item do portfólio?')) {
    return
  }
  try {
    await portfolioApi.removeFromPortfolio(itemId)
    await loadPortfolio()
  } catch (err) {
    alert('Erro ao remover item do portfólio')
    console.error(err)
  }
}

const goToAssets = () => {
  router.push('/')
}

onMounted(() => {
  loadPortfolio()

  if (typeof window !== 'undefined') {
    window.addEventListener('portfolio-changed', loadPortfolio)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('portfolio-changed', loadPortfolio)
  }
})
</script>
