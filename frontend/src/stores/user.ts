import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  AuthApi,
  UserApi,
  Configuration,
  type IUser,
  type LoginRequest,
  type LogoutRequest,
  type ResetPasswordRequest,
  type UpdatePasswordRequest,
  type User
} from '@/api'
import { useCartStore } from '@/stores/cart'

const configuration = new Configuration({
  basePath: import.meta.env.VITE_API_BASE_URL as string,
  baseOptions: {
    withCredentials: true
  }
})

const authApi = new AuthApi(configuration)
const userApi = new UserApi(configuration)

export const useUserStore = defineStore('user', () => {
  const user = ref<IUser | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(true)
  const scopes = ref<string[]>([])
  const message = ref<string | null>(null)
  const mustChangePassword = ref(false)

  function saveUserData() {
    if (user.value && token.value) {
      localStorage.setItem('user', JSON.stringify(user.value))
      localStorage.setItem('token', token.value)
      localStorage.setItem('scopes', JSON.stringify(scopes.value))
      localStorage.setItem('mustChangePassword', JSON.stringify(mustChangePassword.value))
    }
  }

  function loadUserData() {
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('token')
    const savedScopes = localStorage.getItem('scopes')
    const savedMustChangePassword = localStorage.getItem('mustChangePassword')
    if (savedUser && savedToken && savedScopes && savedMustChangePassword !== null) {
      user.value = JSON.parse(savedUser)
      token.value = savedToken
      scopes.value = JSON.parse(savedScopes)
      mustChangePassword.value = JSON.parse(savedMustChangePassword)
    }
  }

  async function login(email: string, password: string) {
    try {
      const loginRequest: LoginRequest = { email, password }
      const response = await authApi.loginUser(loginRequest)
      user.value = response.data.user
      token.value = response.data.token
      scopes.value = response.data.user.scopes || []
      mustChangePassword.value = response.data.mustChangePassword
      saveUserData()
      loading.value = false
      const cartStore = useCartStore()
      cartStore.clearCart()
      message.value = null
    } catch (error: any) {
      message.value = error.response?.data?.message || 'An error occurred during login.'
      console.error('Login failed:', error)
      user.value = null
      token.value = null
      scopes.value = []
      mustChangePassword.value = false
      loading.value = false
      throw error
    }
  }

  function clearUserData() {
    user.value = null
    token.value = null
    scopes.value = []
    mustChangePassword.value = false
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('scopes')
    localStorage.removeItem('mustChangePassword')
  }

  async function logout() {
    if (token.value) {
      const logoutRequest: LogoutRequest = { token: token.value }
      console.log('Logging out:', logoutRequest)
      await authApi.logoutUser(logoutRequest)
      console.log('Logged out')
      clearUserData()
      const cartStore = useCartStore()
      cartStore.clearCart()
    }
  }

  async function resetPassword(token: string, newPassword: string) {
    try {
      const updateRequest: UpdatePasswordRequest = { token, newPassword }
      const response = await authApi.resetPassword(updateRequest)
      message.value = response.data.message
    } catch (error) {
      message.value = 'An error occurred. Please try again.'
    }
  }

  async function resendConfirmationEmail(email: string) {
    try {
      await authApi.resendConfirmationEmail({ email })
      message.value = 'A new confirmation email has been sent. Please check your email.'
    } catch (error: any) {
      message.value =
        error.response?.data?.message ||
        "Une erreur est survenue lors de l'envoi de l'email de confirmation."
    }
  }

  async function updateEmail(newEmail: string) {
    try {
      if (!user.value || !token.value) {
        throw new Error('User not authenticated')
      }

      const updatedUserData: Partial<IUser> = {
        ...user.value,
        email: newEmail
      }
      console.log(updatedUserData)

      const response = await userApi.updateUser(user.value.id, updatedUserData)

      if (response.data) {
        user.value = response.data
        saveUserData()
      }

      message.value = 'Email updated successfully.'
    } catch (error: any) {
      console.error('Failed to update email:', error)
      message.value = error.response?.data?.message || 'An error occurred while updating email.'
      throw error
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
    resetPassword,
    setUser,
    resendConfirmationEmail,
    loading,
    message,
    clearUserData,
    updateEmail,
    isAuthenticated: computed(() => !!user.value),
    hasScope: (requiredScope: string) => scopes.value.includes(requiredScope),
    mustChangePassword
  }
})
