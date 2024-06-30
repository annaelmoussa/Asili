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
      <button type="submit">{{ $t('app.auth.loginButton') }}</button>
      <p @click="navigateToSignup">{{ $t('app.auth.signupPrompt') }}</p>
      <span v-if="errorMessage" class="error-message">{{ errorMessage }}</span>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()
const userStore = useUserStore()

const handleLogin = async () => {
  try {
    errorMessage.value = ''
    await userStore.login(email.value, password.value)
    router.push('/')
  } catch (error) {
    errorMessage.value = 'Mot de passe ou email incorrect'
  }
}

const navigateToSignup = () => {
  router.push('/signup')
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

.error-message {
  color: red;
  text-align: center;
  margin-top: 10px;
  display: block;
}
</style>
