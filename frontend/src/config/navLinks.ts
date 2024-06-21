import { Bell, CircleUser, Home, LineChart, Menu, Package, Package2, Search, ShoppingCart, Users } from 'lucide-vue-next'
import { defineComponent } from 'vue';

interface NavLink {
  name: string;
  path: string;
  icon: ReturnType<typeof defineComponent>;
}

const navLinks: NavLink[] = [
  { name: 'Dashboard', path: '/panel/dashboard', icon: Home },
  { name: 'Commandes', path: '/panel/orders', icon: ShoppingCart },
  { name: 'Produits', path: '/panel/products', icon: CircleUser },
  { name: 'Utilisateurs', path: '/panel/users', icon: Users},
];
  
  export default navLinks;