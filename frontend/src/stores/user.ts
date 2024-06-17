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
  const user = ref<IUser | null>(null);
  const token = ref<string | null>(null);
  const loading = ref(true);
  const message = ref<string | null>(null);

  function saveUserData() {
    if (user.value && token.value) {
      localStorage.setItem('user', JSON.stringify(user.value));
      localStorage.setItem('token', token.value);
    }
  }

  function loadUserData() {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      user.value = JSON.parse(savedUser);
      token.value = savedToken;
    }
  }

  async function login(email: string, password: string) {
    try {
      const loginRequest: LoginRequest = { email, password };
      const response = await authApi.login(loginRequest);
      user.value = response.data.user;
      token.value = response.data.token;
      saveUserData();   
      loading.value = false;
      const cartStore = useCartStore();
      cartStore.clearCart();
      message.value = null;
    } catch (error) {
      message.value = error.response?.data?.message || 'An error occurred during login.';
      user.value = null;
      token.value = null;
      loading.value = false;
    }
  }

  async function logout() {
    if (token.value) {
      const logoutRequest: LogoutRequest = { token: token.value };
      await authApi.logout(logoutRequest);
      user.value = null;
      token.value = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      const cartStore = useCartStore();
      cartStore.clearCart();
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
    login,
    logout,
    resetPassword,
    setUser,
    resendConfirmationEmail,
    loading,
    message,
    isAuthenticated: computed(() => !!user.value),
  };
});
