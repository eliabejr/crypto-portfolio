<template>
  <AppContainer>
    <div class="py-6 space-y-6">
      <section>
        <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              Dashboard
            </h1>
            <p class="mt-2 text-base sm:text-lg text-gray-600 dark:text-gray-400">
              Visão geral do portfólio
            </p>
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            Atualizado:
            <span class="font-medium text-gray-700 dark:text-gray-200">{{ updatedAt }}</span>
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

        <div
          class="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-start justify-between gap-4">
            <div>
              <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Ativos na watchlist
              </div>
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
            <router-link to="/favorites"
              class="text-xs font-semibold text-[#2E4F00] hover:text-[#1F3500] dark:text-[#86BC25] dark:hover:text-[#C9F77B]">
              Ver favoritos
            </router-link>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div
            class="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Performance
                </div>
                <div class="mt-1 text-lg font-semibold">Atual</div>
              </div>
            </div>

            <div
              class="mt-4 rounded-xl border border-gray-200 bg-gradient-to-b from-[#86BC25]/10 to-white p-4 dark:border-gray-800 dark:from-[#86BC25]/10 dark:to-gray-900">
              <div class="flex items-end justify-between gap-6">
                <div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">Retorno</div>
                  <div class="mt-1 text-2xl font-bold tabular-nums">
                    {{ performanceText }}
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-xs text-gray-500 dark:text-gray-400">P&L</div>
                  <div class="mt-1 text-lg font-semibold tabular-nums">
                    {{ pnlText }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Alocação</div>
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
              Baseado no valor atual estimado do portfólio.
            </div>
          </div>
        </div>
      </section>
    </div>
  </AppContainer>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { favoritesApi } from '../../favorites/api/favorites.api'
import { portfolioApi } from '../../portfolio/api/portfolio.api'
import type { PortfolioItem } from '../../portfolio/types'
import AppContainer from '../../../components/layout/AppContainer.vue'

const updatedAt = ref(
  new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date())
)

const watchlistCount = ref(0)
const portfolioItems = ref<PortfolioItem[]>([])

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

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

const formatPercent = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 2 }).format(value)

const getItemValue = (item: PortfolioItem) => {
  const price = item.asset.current_price ?? item.avgPrice
  return item.quantity * price
}

const totalCost = computed(() =>
  portfolioItems.value.reduce((sum, item) => sum + item.quantity * item.avgPrice, 0)
)
const totalValue = computed(() =>
  portfolioItems.value.reduce((sum, item) => sum + getItemValue(item), 0)
)

const pnlValue = computed(() => totalValue.value - totalCost.value)
const pnlPct = computed(() => (totalCost.value > 0 ? pnlValue.value / totalCost.value : 0))

const performanceText = computed(() => formatPercent(pnlPct.value))
const pnlText = computed(() => formatCurrency(pnlValue.value))

const allocation = computed(() => {
  const total = totalValue.value
  if (total <= 0) return []

  return [...portfolioItems.value]
    .map((item) => ({
      symbol: item.asset.symbol.toUpperCase(),
      name: item.asset.name,
      value: getItemValue(item),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 4)
    .map((row) => ({
      symbol: row.symbol,
      name: row.name,
      percent: Math.max(0, Math.round((row.value / total) * 100)),
    }))
})

const kpis = computed<Kpi[]>(() => [
  {
    title: 'Valor do portfólio',
    value: formatCurrency(totalValue.value),
    caption: 'estimado',
    tone: pnlValue.value >= 0 ? 'positive' : 'negative',
    icon: 'wallet',
  },
  {
    title: 'Performance',
    value: formatPercent(pnlPct.value),
    caption: 'vs. preço médio',
    tone: pnlValue.value >= 0 ? 'positive' : 'negative',
    icon: 'trend',
  },
  {
    title: 'Ativos no portfólio',
    value: String(portfolioItems.value.length),
    caption: 'posições',
    tone: 'neutral',
    icon: 'coin',
  },
  {
    title: 'Favoritos',
    value: String(watchlistCount.value),
    caption: 'salvos',
    tone: 'neutral',
    icon: 'star',
  },
])

void kpis
void allocation
void performanceText
void pnlText

const loadDashboard = async () => {
  const [favorites, portfolio] = await Promise.all([
    favoritesApi.listFavorites(),
    portfolioApi.getPortfolio(),
  ])
  watchlistCount.value = favorites.length
  portfolioItems.value = portfolio.items
  updatedAt.value = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(
    new Date()
  )
}

onMounted(() => {
  loadDashboard()
  if (typeof window !== 'undefined') {
    window.addEventListener('watchlist-changed', loadDashboard)
    window.addEventListener('portfolio-changed', loadDashboard)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('watchlist-changed', loadDashboard)
    window.removeEventListener('portfolio-changed', loadDashboard)
  }
})
</script>
