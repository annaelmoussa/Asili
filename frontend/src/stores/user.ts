import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { AuthApi, Configuration, type IUser, type LoginRequest, type LogoutRequest } from '@/api'
import { useCartStore } from '@/stores/cart'

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
  const scopes = ref<string[]>([])

  function saveUserData() {
    if (user.value && token.value) {
      localStorage.setItem('user', JSON.stringify(user.value))
      localStorage.setItem('token', token.value)
      localStorage.setItem('scopes', JSON.stringify(scopes.value))
    }
  }

  function loadUserData() {
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('token')
    const savedScopes = localStorage.getItem('scopes')
    if (savedUser && savedToken && savedScopes) {
      user.value = JSON.parse(savedUser)
      token.value = savedToken
      scopes.value = JSON.parse(savedScopes)
    }
  }

  async function login(email: string, password: string) {
    try {
      const loginRequest: LoginRequest = { email, password }
      const response = await authApi.loginUser(loginRequest)
      user.value = response.data.user
      token.value = response.data.token
      scopes.value = response.data.user.scopes || []
      saveUserData()
      loading.value = false
      const cartStore = useCartStore()
      cartStore.clearCart()
    } catch (error) {
      console.error('Login failed:', error)
      user.value = null
      token.value = null
      scopes.value = []
      loading.value = false
      throw error
    }
  }

  function clearUserData() {
    user.value = null
    token.value = null
    scopes.value = []
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('scopes')
  }

  async function logout() {
    if (token.value) {
      const logoutRequest: LogoutRequest = { token: token.value }
      console.log('Logging out:', logoutRequest)
      await authApi.logoutUser(logoutRequest)
      console.log('Logged out')
      user.value = null
      token.value = null
      scopes.value = []
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      const cartStore = useCartStore()
      cartStore.clearCart()
      localStorage.removeItem('scopes')
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
    scopes,
    login,
    logout,
    setUser,
    loading,
    clearUserData,
    isAuthenticated: computed(() => !!user.value),
    hasScope: (requiredScope: string) => scopes.value.includes(requiredScope)
  }
})
