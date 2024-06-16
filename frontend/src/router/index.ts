import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginPage from '../views/LoginPage.vue'
import SignupPage from '../views/SignUpPage.vue'
import { useUserStore } from '@/stores/user'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/signup', name: 'signup', component: SignupPage },
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
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !userStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
