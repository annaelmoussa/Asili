import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { AuthApi, Configuration, type IUser, type LoginRequest, type LogoutRequest, type ResetPasswordRequest, type UpdatePasswordRequest } from '@/api';
import { useCartStore } from "@/stores/cart";

const configuration = new Configuration({
  basePath: 'http://localhost:3000',
  baseOptions: {
    withCredentials: true,
  },
});

const authApi = new AuthApi(configuration);

export const useUserStore = defineStore('user', () => {
  const user = ref<IUser | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(true)
  const scopes = ref<string[]>([])
  const message = ref<string | null>(null);
  const mustChangePassword = ref(false);

  function saveUserData() {
    if (user.value && token.value) {
      localStorage.setItem('user', JSON.stringify(user.value))
      localStorage.setItem('token', token.value)
      localStorage.setItem('scopes', JSON.stringify(scopes.value))
      localStorage.setItem('mustChangePassword', JSON.stringify(mustChangePassword.value));
    }
  }

  function loadUserData() {
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('token')
    const savedScopes = localStorage.getItem('scopes')
    const savedMustChangePassword = localStorage.getItem('mustChangePassword');
    if (savedUser && savedToken && savedScopes && savedMustChangePassword !== null) {
      user.value = JSON.parse(savedUser)
      token.value = savedToken
      scopes.value = JSON.parse(savedScopes)
      mustChangePassword.value = JSON.parse(savedMustChangePassword);
    }
  }

  async function login(email: string, password: string) {
    try {
      const loginRequest: LoginRequest = { email, password }
      const response = await authApi.loginUser(loginRequest)
      user.value = response.data.user
      token.value = response.data.token
      scopes.value = response.data.user.scopes || []
      mustChangePassword.value = response.data.mustChangePassword;
      saveUserData()
      loading.value = false
      const cartStore = useCartStore()
      cartStore.clearCart()
      message.value = null;
    } catch (error) {
      message.value = error.response?.data?.message || 'An error occurred during login.';
      console.error('Login failed:', error)
      user.value = null
      token.value = null
      scopes.value = []
      mustChangePassword.value = false;
      loading.value = false
      throw error
    }
  }

  function clearUserData() {
    user.value = null
    token.value = null
    scopes.value = []
    mustChangePassword.value = false;
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('scopes')
    localStorage.removeItem('mustChangePassword');
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
      mustChangePassword.value = false;
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      const cartStore = useCartStore()
      cartStore.clearCart()
      localStorage.removeItem('scopes')
      localStorage.removeItem('mustChangePassword');
    }
  }

  async function resetPassword(token: string, newPassword: string) {
    try {
      const updateRequest: UpdatePasswordRequest = { token, newPassword };
      const response = await authApi.resetPassword(updateRequest);
      message.value = response.data.message;
    } catch (error) {
      message.value = 'An error occurred. Please try again.';
    }
  }
  
  async function resendConfirmationEmail(email: string) {
    try {
      await authApi.resendConfirmationEmail({ email });
      message.value = 'A new confirmation email has been sent. Please check your email.';
    } catch (error) {
      message.value = error.response?.data?.message || 'Une errur est survenue lors de l\'envoi de l\'email de confirmation.';
    }
  }

  function setUser(newUser: IUser) {
    user.value = newUser;
    saveUserData();
  }

  loadUserData();

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
    isAuthenticated: computed(() => !!user.value),
    hasScope: (requiredScope: string) => scopes.value.includes(requiredScope),
    mustChangePassword
  }
})
