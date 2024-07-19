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
}

const navLinks: NavLink[] = [
  { name: 'Dashboard', path: '/panel/dashboard', icon: Home },
  { name: 'Gestion des stocks', path: '/panel/stock', icon: Package2 },
  { name: 'Commandes', path: '/panel/orders', icon: ShoppingCart },
  { name: 'Produits', path: '/panel/products', icon: Package2 },
  { name: 'Utilisateurs', path: '/panel/users', icon: Users },
  { name: 'Paiements', path: '/panel/payments', icon: CreditCard },
  { name: 'Catégories', path: '/panel/categories', icon: Menu },
  { name: 'Marques', path: '/panel/brands', icon: Package },
  { name: 'Paramètres', path: '/panel/settings', icon: Bell },
  { name: 'Recherche', path: '/search', icon: Search },
  { name: 'Panier', path: '/cart', icon: ShoppingCart }
]

export default navLinks
