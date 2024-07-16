import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginPage from '../views/LoginPage.vue'
import SignupPage from '../views/SignUpPage.vue'
import ProductSingleView from '../views/ProductSingleView.vue'
import CartView from '../views/CartView.vue'
import { useUserStore } from '@/stores/user'
import DashboardView from '../views/DashboardView.vue'
import PanelLayout from '../views/Layout/PanelLayout.vue'
import PanelDashboard from '../views/Panel/PanelDashboardView.vue'
import PanelUsers from '../views/Panel/PanelUsersView.vue'
import PanelSettings from '../views/Panel/PanelSettingsView.vue'
import PanelProduct from '../views/Panel/PanelProductView.vue'
import PanelOrder from '../views/Panel/PanelOrderView.vue'
import SearchView from '../views/SearchView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupPage
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: () => import('../views/FavoritesView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'orders',
    component: () => import('../views/OrdersView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/referrals',
    name: 'referrals',
    component: () => import('../views/ReferralsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/member-benefits',
    name: 'member-benefits',
    component: () => import('../views/MemberBenefitsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/product/:productId',
    name: 'ProductSingleView',
    component: ProductSingleView
  },
  {
    path: '/cart',
    name: 'cart',
    component: CartView
  },
  {
    path: '/search',
    name: 'search',
    component: SearchView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/panel',
    component: PanelLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: 'dashboard',
        name: 'PanelDashboard',
        component: PanelDashboard
      },
      {
        path: 'users',
        name: 'PanelUsers',
        component: PanelUsers
      },
      {
        path: 'settings',
        name: 'PanelSettings',
        component: PanelSettings
      },
      {
        path: 'products',
        name: 'PanelProducts',
        component: PanelProduct
      },
      {
        path: 'orders',
        name: 'PanelOrders',
        component: PanelOrder
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin)

  if (requiresAuth && !userStore.isAuthenticated) {
    next('/login')
  } else if (requiresAdmin && userStore.user?.role !== 'ROLE_ADMIN') {
    console.log('Access denied: Admin role required')
    next('/')
  } else {
    next()
  }
})

export default router
