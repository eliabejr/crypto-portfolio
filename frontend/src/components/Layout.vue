<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
    <div class="flex min-h-screen">
      <aside
        class="hidden lg:flex lg:w-72 lg:flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div class="h-16 px-6 flex items-center border-b border-gray-200 dark:border-gray-800">
          <router-link to="/" class="flex items-center gap-3 font-semibold tracking-tight hover:opacity-90">
            <span
              class="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#86BC25] to-[#6AA81E] text-black shadow-sm">
              <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 3v18m7-9H5m12 5H7m10-10H9" />
              </svg>
            </span>
            <div class="leading-tight">
              <div class="text-sm text-gray-500 dark:text-gray-400">Crypto</div>
              <div class="text-base">Portfolio</div>
            </div>
          </router-link>
        </div>

        <nav class="flex-1 px-3 py-4">
          <div class="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Navegação
          </div>

          <router-link to="/"
            class="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            active-class="bg-[#86BC25]/10 text-[#2E4F00] dark:bg-[#86BC25]/15 dark:text-[#C9F77B]">
            <span
              class="grid h-9 w-9 place-items-center rounded-lg bg-gray-100 text-gray-600 group-hover:bg-white dark:bg-gray-800 dark:text-gray-300 dark:group-hover:bg-gray-900">
              <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" />
              </svg>
            </span>
            <span class="flex-1">Dashboard</span>
          </router-link>

          <router-link to="/assets"
            class="group mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            active-class="bg-[#86BC25]/10 text-[#2E4F00] dark:bg-[#86BC25]/15 dark:text-[#C9F77B]">
            <span
              class="grid h-9 w-9 place-items-center rounded-lg bg-gray-100 text-gray-600 group-hover:bg-white dark:bg-gray-800 dark:text-gray-300 dark:group-hover:bg-gray-900">
              <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </span>
            <span class="flex-1">Ativos</span>
          </router-link>

          <router-link to="/portfolio"
            class="group mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            active-class="bg-[#86BC25]/10 text-[#2E4F00] dark:bg-[#86BC25]/15 dark:text-[#C9F77B]">
            <span
              class="grid h-9 w-9 place-items-center rounded-lg bg-gray-100 text-gray-600 group-hover:bg-white dark:bg-gray-800 dark:text-gray-300 dark:group-hover:bg-gray-900">
              <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3v18h18M7 14l4-4 3 3 5-6" />
              </svg>
            </span>
            <span class="flex-1">Portfolio</span>
          </router-link>

          <router-link to="/favorites"
            class="group mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            active-class="bg-[#86BC25]/10 text-[#2E4F00] dark:bg-[#86BC25]/15 dark:text-[#C9F77B]">
            <span
              class="grid h-9 w-9 place-items-center rounded-lg bg-gray-100 text-gray-600 group-hover:bg-white dark:bg-gray-800 dark:text-gray-300 dark:group-hover:bg-gray-900">
              <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.98 10.1c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </span>
            <span class="flex-1">Favoritos</span>
            <span class="min-w-8 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">
              {{ watchlistCount }}
            </span>
          </router-link>
        </nav>
      </aside>

      <div class="flex min-w-0 flex-1 flex-col">
        <main class="flex-1">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { cryptoService } from '../services/cryptoService'

const watchlistCount = ref(0)

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
</script>
