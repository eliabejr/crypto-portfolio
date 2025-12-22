<template>
  <div class="w-full">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <section class="mb-10">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              Dashboard
            </h1>
            <p class="mt-2 text-base sm:text-lg text-gray-600 dark:text-gray-400">
              Visão geral do portfólio (métricas simuladas)
            </p>
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            Atualizado: <span class="font-medium text-gray-700 dark:text-gray-200">{{ updatedAt }}</span>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div v-for="kpi in kpis" :key="kpi.title"
            class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div class="flex items-start justify-between gap-4">
              <div>
                <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {{ kpi.title }}
                </div>
                <div class="mt-1 text-2xl font-bold tracking-tight tabular-nums">
                  {{ kpi.value }}
                </div>
              </div>
              <div :class="[
                'h-10 w-10 rounded-xl grid place-items-center border',
                kpi.tone === 'positive'
                  ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-300'
                  : kpi.tone === 'negative'
                    ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300'
                    : 'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300',
              ]">
                <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor">
                  <path v-if="kpi.icon === 'wallet'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2m2-6h-4a2 2 0 000 4h4m0-4v4" />
                  <path v-else-if="kpi.icon === 'trend'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 17l6-6 4 4 7-7M21 10V3h-7" />
                  <path v-else-if="kpi.icon === 'star'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.98 10.1c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8c-1.657 0-3 1.12-3 2.5S10.343 13 12 13s3 1.12 3 2.5S13.657 18 12 18m0-10V6m0 12v-2m7-4a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div class="mt-3 flex items-center justify-between">
              <div v-if="kpi.delta" :class="[
                'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums',
                kpi.tone === 'positive'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                  : kpi.tone === 'negative'
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200',
              ]">
                {{ kpi.delta }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">{{ kpi.caption }}</div>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-start justify-between gap-4">
            <div>
              <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Ativos na watchlist</div>
              <div class="mt-1 text-2xl font-bold tracking-tight tabular-nums">
                {{ watchlistCount }}
              </div>
            </div>
            <div
              class="h-10 w-10 rounded-xl grid place-items-center border border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
              <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.98 10.1c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>

          <div class="mt-3 flex items-center justify-between">
            <div class="text-xs text-gray-500 dark:text-gray-400">salvos</div>
            <router-link to="/favoritos"
              class="text-xs font-semibold text-[#2E4F00] hover:text-[#1F3500] dark:text-[#86BC25] dark:hover:text-[#C9F77B]">
              Ver watchlist
            </router-link>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div
            class="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Performance (mock)
                </div>
                <div class="mt-1 text-lg font-semibold">Últimos 7 dias</div>
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">Sparkline ilustrativa</div>
            </div>

            <div
              class="mt-4 rounded-xl border border-gray-200 bg-gradient-to-b from-[#86BC25]/10 to-white p-4 dark:border-gray-800 dark:from-[#86BC25]/10 dark:to-gray-900">
              <svg viewBox="0 0 400 120" class="w-full h-28" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stop-color="rgb(134 188 37)" stop-opacity="0.35" />
                    <stop offset="100%" stop-color="rgb(134 188 37)" stop-opacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,90 C40,70 70,95 110,70 C150,45 190,60 230,40 C270,20 320,35 360,25 C380,20 390,25 400,18 L400,120 L0,120 Z"
                  fill="url(#area)" />
                <path d="M0,90 C40,70 70,95 110,70 C150,45 190,60 230,40 C270,20 320,35 360,25 C380,20 390,25 400,18"
                  fill="none" stroke="rgb(134 188 37)" stroke-width="3" stroke-linecap="round" />
              </svg>
            </div>
          </div>

          <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Alocação (mock)</div>
            <div class="mt-1 text-lg font-semibold">Top ativos</div>

            <div class="mt-4 space-y-4">
              <div v-for="row in allocation" :key="row.symbol" class="space-y-2">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-semibold">{{ row.symbol }}</span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">{{ row.name }}</span>
                  </div>
                  <div class="text-sm font-semibold tabular-nums">{{ row.percent }}%</div>
                </div>
                <div class="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div class="h-2 rounded-full bg-gradient-to-r from-[#86BC25] to-[#6AA81E]"
                    :style="{ width: `${row.percent}%` }" />
                </div>
              </div>
            </div>

            <div class="mt-5 text-xs text-gray-500 dark:text-gray-400">
              Dica: adicione/remova itens da watchlist para ver o contador no topo atualizar.
            </div>
          </div>
        </div>
      </section>

      <div class="mb-10">
        <div class="mb-2">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Criptomoedas
          </h1>
          <p class="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Explore e acompanhe o mercado de criptomoedas
          </p>
        </div>

        <div class="mt-6 max-w-2xl">
          <Input v-model="searchInput" placeholder="Buscar por nome ou símbolo...">
            <template #icon>
              <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg v-if="!isSearching" class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <Loader v-else size="sm" />
              </div>
            </template>
          </Input>
        </div>
      </div>

      <div v-if="isError"
        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3 flex-1">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
              Erro ao carregar criptomoedas
            </h3>
            <p class="text-sm text-red-700 dark:text-red-300 mb-4">
              {{ error?.message || 'Ocorreu um erro inesperado. Tente novamente.' }}
            </p>
            <Button @click="retry">Tentar novamente</Button>
          </div>
        </div>
      </div>

      <div v-else-if="isEmpty"
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor"
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          Nenhuma criptomoeda encontrada
        </h3>
        <p class="text-gray-500 dark:text-gray-400">Tente ajustar sua busca ou filtros</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <CryptoCard v-for="crypto in items" :key="crypto.id" :crypto="crypto" />

        <template v-if="isLoading">
          <CryptoCardSkeleton v-for="n in 8" :key="`skeleton-${n}`" />
        </template>
      </div>

      <div v-if="isEndReached && !isEmpty" class="mt-12 text-center py-8 border-t border-gray-200 dark:border-gray-700">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Todas as criptomoedas foram carregadas
        </p>
      </div>

      <div v-if="hasMore && !isLoading && !isEmpty" class="mt-8 text-center">
        <Button variant="secondary" @click="loadMore">Carregar mais</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDebounce } from '../composables/useDebounce'
import { cryptoService } from '../services/cryptoService'
import CryptoCard from '../components/CryptoCard.vue'
import CryptoCardSkeleton from '../components/CryptoCardSkeleton.vue'
import Input from '../components/ui/Input.vue'
import Button from '../components/ui/Button.vue'
import Loader from '../components/ui/Loader.vue'

const route = useRoute()
const router = useRouter()

const searchInput = ref((route.query.search as string) || '')

const updatedAt = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
}).format(new Date())

const watchlistCount = ref(cryptoService.getWatchlist().length)

type KpiTone = 'positive' | 'negative' | 'neutral'
type KpiIcon = 'wallet' | 'trend' | 'star' | 'coin'

type Kpi = {
  title: string
  value: string
  delta?: string
  caption: string
  tone: KpiTone
  icon: KpiIcon
}

const syncWatchlistCount = () => {
  watchlistCount.value = cryptoService.getWatchlist().length
}

onMounted(() => {
  syncWatchlistCount()
  if (typeof window !== 'undefined') {
    window.addEventListener('watchlist-changed', syncWatchlistCount)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('watchlist-changed', syncWatchlistCount)
  }
})

const kpis: Kpi[] = [
  {
    title: 'Valor do portfólio',
    value: '$128,450.23',
    delta: '+$2,691.12',
    caption: 'nas últimas 24h',
    tone: 'positive',
    icon: 'wallet',
  },
  {
    title: 'Performance (24h)',
    value: '+2.14%',
    delta: '+0.36pp',
    caption: 'vs. ontem',
    tone: 'positive',
    icon: 'trend',
  },
  {
    title: 'Pior dia (7d)',
    value: '-1.18%',
    delta: '-0.22pp',
    caption: 'variação',
    tone: 'negative',
    icon: 'coin',
  },
]

const allocation = [
  { symbol: 'BTC', name: 'Bitcoin', percent: 46 },
  { symbol: 'ETH', name: 'Ethereum', percent: 28 },
  { symbol: 'SOL', name: 'Solana', percent: 14 },
  { symbol: 'USDC', name: 'Stable', percent: 12 },
]

const debouncedSearch = useDebounce(searchInput, 500)
const isSearching = ref(false)

watch(debouncedSearch, value => {
  if (value !== route.query.search) {
    router.replace({ query: { ...route.query, search: value || undefined } })
    isSearching.value = true
    search(value).finally(() => {
      isSearching.value = false
    })
  }
})

onMounted(() => {
  if (route.query.search && route.query.search !== searchInput.value) {
    searchInput.value = route.query.search as string
  }
})
</script>
