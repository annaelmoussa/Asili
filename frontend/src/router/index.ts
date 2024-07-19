import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginPage from '../views/LoginPage.vue'
import ResetPasswordRequestView from '../views/ResetPasswordRequestView.vue'
import ResetPasswordView from '../views/ResetPasswordView.vue'
import SignupPage from '../views/SignUpPage.vue'
import ProductSingleView from '../views/ProductSingleView.vue'
import CartView from '../views/CartView.vue'
import { useUserStore } from '@/stores/user'
import DashboardView from '../views/DashboardView.vue'
import PanelLayout from '../views/Layout/PanelLayout.vue'
import PanelUsers from '../views/Panel/PanelUsersView.vue'
import PanelSettings from '../views/Panel/PanelSettingsView.vue'
import PanelProduct from '../views/Panel/PanelProductView.vue'
import PanelOrder from '../views/Panel/PanelOrderView.vue'
import PanelPayment from '../views/Panel/PanelPaymentsView.vue'
import StripeCheckoutRedirect from '../components/StripeCheckoutRedirect.vue'
import PaymentSuccess from '../views/PaymentSuccessView.vue'
import ChangePasswordView from '../views/ChangePasswordView.vue'
import UserProfile from '../views/ProfileView.vue'
import UserData from '../views/UserDataView.vue'
import UserNotification from '../views/UserNotificationView.vue'
import SearchView from '../views/SearchView.vue'
import PanelCategories from '../views/Panel/PanelCategoriesView.vue'
import PanelBrands from '../views/Panel/PanelBrandsView.vue'
import FavoritesView from '../views/FavoritesView.vue'
import OrdersView from '../views/OrdersView.vue'
import ReferralsView from '../views/ReferralsView.vue'
import MemberBenefitsView from '../views/MemberBenefitsView.vue'
import PanelViewStock from '../views/Panel/PanelStockView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: { hideNavbar: true }
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupPage,
    meta: { hideNavbar: true }
  },
  {
    path: '/reset-password-request',
    name: 'reset-password-request',
    component: ResetPasswordRequestView,
    meta: { hideNavbar: true }
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: ResetPasswordView,
    meta: { hideNavbar: true }
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: FavoritesView,
    meta: { requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'orders',
    component: OrdersView,
    meta: { requiresAuth: true }
  },
  {
    path: '/referrals',
    name: 'referrals',
    component: ReferralsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/member-benefits',
    name: 'member-benefits',
    component: MemberBenefitsView,
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
    path: '/stripe-checkout',
    name: 'StripeCheckoutRedirect',
    component: StripeCheckoutRedirect
  },
  {
    path: '/payment-success',
    name: 'PaymentSuccess',
    component: PaymentSuccess
  },
  {
    path: '/panel',
    component: PanelLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: DashboardView
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
        path: 'categories',
        name: 'PanelCategories',
        component: PanelCategories
      },
      {
        path: 'brands',
        name: 'PanelBrands',
        component: PanelBrands
      },
      {
        path: 'orders',
        name: 'PanelOrders',
        component: PanelOrder
      },
      {
        path: 'stock',
        name: 'PanelStock',
        component: PanelViewStock
      },
      {
        path: 'payments',
        name: 'PanelPayments',
        component: PanelPayment
      }
    ]
  },
  {
    path: '/change-password',
    name: 'change-password',
    component: ChangePasswordView
  },
  {
    path: '/profile',
    name: 'profile',
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'profile',
        component: UserProfile,
        meta: { requiresAuth: true }
      },
      {
        path: 'data',
        name: 'data',
        component: UserData
      },
      {
        path: 'notifications',
        name: 'notifications',
        component: UserNotification
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
  } else if (
    userStore.isAuthenticated &&
    userStore.mustChangePassword &&
    to.name !== 'change-password'
  ) {
    next('/change-password')
  } else {
    next()
  }
})

export default router
