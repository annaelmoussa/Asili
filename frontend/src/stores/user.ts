import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { AuthApi, Configuration, type IUser, type LoginRequest, type LogoutRequest } from '@/api'
import {useCartStore} from "@/stores/cart";

const configuration = new Configuration({
  basePath: 'http://localhost:3000',
  baseOptions: {
    withCredentials: true
  }
})

const authApi = new AuthApi(configuration)

export const useUserStore = defineStore('user', () => {
  const user = ref<IUser | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(true)

  function saveUserData() {
    if (user.value && token.value) {
      localStorage.setItem('user', JSON.stringify(user.value))
      localStorage.setItem('token', token.value)
    }
  }

  function loadUserData() {
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('token')
    if (savedUser && savedToken) {
      user.value = JSON.parse(savedUser)
      token.value = savedToken
    }
  }

  async function login(email: string, password: string) {
    try {
      const loginRequest: LoginRequest = { email, password }
      const response = await authApi.login(loginRequest)
      user.value = response.data.user
      token.value = response.data.token
      saveUserData()
      loading.value = false
      const cartStore = useCartStore();
      cartStore.clearCart();
    } catch (error) {
      console.error('Login failed:', error)
      user.value = null
      token.value = null
      loading.value = false
    }
  }

  async function logout() {
    if (token.value) {
      const logoutRequest: LogoutRequest = { token: token.value }
      await authApi.logout(logoutRequest)
      user.value = null
      token.value = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      const cartStore = useCartStore();
      cartStore.clearCart();
    }
  }

  function setUser(newUser: IUser) {
    user.value = newUser
    saveUserData()
  }

  loadUserData()

  return {
    user,
    token,
    login,
    logout,
    setUser,
    loading,
    isAuthenticated: computed(() => !!user.value)
  }
})
