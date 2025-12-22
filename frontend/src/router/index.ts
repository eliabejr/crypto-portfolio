import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '../modules/dashboard/pages/DashboardPage.vue'
import AssetsPage from '../modules/assets/pages/AssetsPage.vue'
import AssetDetailPage from '../modules/assets/pages/AssetDetailPage.vue'
import PortfolioPage from '../modules/portfolio/pages/PortfolioPage.vue'
import FavoritesPage from '../modules/favorites/pages/FavoritesPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardPage,
    },
    {
      path: '/assets',
      name: 'assets',
      component: AssetsPage,
    },
    {
      path: '/assets/:id',
      name: 'asset-detail',
      component: AssetDetailPage,
      props: true,
    },
    {
      path: '/portfolio',
      name: 'portfolio',
      component: PortfolioPage,
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: FavoritesPage,
    },
  ],
})

export default router
