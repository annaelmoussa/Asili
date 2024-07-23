import {
  Bell,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Users,
  CreditCard
} from 'lucide-vue-next'
import { defineComponent } from 'vue'

interface NavLink {
  name: string
  path: string
  icon: ReturnType<typeof defineComponent>
  requiresAuth?: boolean
  requiresAdmin?: boolean
}

const navLinks: NavLink[] = [
  { name: 'Dashboard', path: '/panel/dashboard', icon: Home, requiresAuth: true, requiresAdmin: true },
  { name: 'Gestion des stocks', path: '/panel/stock', icon: Package2, requiresAuth: true, requiresAdmin: true },
  { name: 'Commandes', path: '/panel/orders', icon: ShoppingCart, requiresAuth: true },
  { name: 'Produits', path: '/panel/products', icon: Package2, requiresAuth: true, requiresAdmin: true },
  { name: 'Utilisateurs', path: '/panel/users', icon: Users, requiresAuth: true, requiresAdmin: true },
  { name: 'Paiements', path: '/panel/payments', icon: CreditCard, requiresAuth: true, requiresAdmin: true },
  { name: 'Catégories', path: '/panel/categories', icon: Menu, requiresAuth: true, requiresAdmin: true },
  { name: 'Marques', path: '/panel/brands', icon: Package, requiresAuth: true, requiresAdmin: true },
  { name: 'Paramètres', path: '/panel/settings', icon: Bell, requiresAuth: true, requiresAdmin: true },
]

export default navLinks