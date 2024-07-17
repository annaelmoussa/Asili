<template>
  <div class="auth-container">
    <form class="auth-form" @submit.prevent="handleLogin">
      <h2>{{ $t('app.auth.loginTitle') }}</h2>
      <label for="email">{{ $t('app.auth.email') }}</label>
      <input type="email" v-model="email" id="email" :placeholder="$t('app.auth.email')" />
      <label for="password">{{ $t('app.auth.password') }}</label>
      <input
        type="password"
        v-model="password"
        id="password"
        :placeholder="$t('app.auth.password')"
      />
      <button @click="handleLogin">{{ $t('app.auth.loginButton') }}</button>
      <p class="loginLink" @click="navigateToSignup">{{ $t('app.auth.signupPrompt') }}</p>
      <p class="loginLink" @click="navigateToResetPassword">Mot de passe oublié?</p>
      <p v-if="message" class="error-message">{{ message }}</p>
      <button v-if="message === 'Please confirm your email address'" @click="handleResendConfirmation">
        Resend Confirmation Email
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const email = ref('')
const password = ref('')
const router = useRouter()
const userStore = useUserStore()
const message = computed(() => userStore.message);

const handleLogin = async () => {
  try {
    await userStore.login(email.value, password.value)
    if (!userStore.message) {
      router.push('/')
    }
    
  } catch (error) {}
}

const handleResendConfirmation = async () => {
  try {
    await userStore.resendConfirmationEmail(email.value)
  } catch (error) {
    console.error('Resend confirmation failed:', error)
  }
}

const navigateToSignup = () => {
  router.push('/signup')
}

const navigateToResetPassword = () => {
  router.push('/reset-password-request')
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f1f2f6;
}

.auth-form {
  background: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 400px;
}

.auth-form h2 {
  margin-bottom: 20px;
}

.auth-form label {
  display: block;
  margin-bottom: 10px;
}

.auth-form input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.auth-form button {
  width: 100%;
  padding: 10px;
  background-color: #42b883;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.auth-form .loginLink {
  color: #42b883;
  cursor: pointer;
  text-align: center;
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 10px;
  display: block;
}
</style>
