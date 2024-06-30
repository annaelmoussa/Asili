<template>
  <div class="auth-container">
    <div class="auth-form">
      <h2>{{ $t('app.auth.signupTitle') }}</h2>
      <label for="email">{{ $t('app.auth.email') }}</label>
      <input type="email" v-model="email" id="email" :placeholder="$t('app.auth.email')" />
      <label for="password">{{ $t('app.auth.password') }}</label>
      <input
        type="password"
        v-model="password"
        id="password"
        :placeholder="$t('app.auth.password')"
      />
      <button @click="signup">{{ $t('app.auth.signupButton') }}</button>
      <p @click="navigateToLogin">{{ $t('app.auth.loginPrompt') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { type SignupRequest } from '@/api'
import { authApi } from '@/api/config'

const email = ref('')
const password = ref('')
const router = useRouter()

const signup = async () => {
  try {
    const signupRequest: SignupRequest = { email: email.value, password: password.value }
    await authApi.signupUser(signupRequest)
    router.push('/login')
  } catch (error) {
    console.error('Signup failed', error)
  }
}

const navigateToLogin = () => {
  router.push('/login')
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

.auth-form p {
  color: #42b883;
  cursor: pointer;
  text-align: center;
}
</style>
