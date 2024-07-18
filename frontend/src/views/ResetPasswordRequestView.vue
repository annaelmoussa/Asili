<template>
  <div class="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
    <div class="flex items-center justify-center py-12">
      <div class="mx-auto grid w-[350px] gap-6">
        <div class="grid gap-2 text-center">
          <h1 class="text-3xl font-bold">
            {{ $t('app.auth.resetPasswordTitle') }}
          </h1>
          <p class="text-balance text-muted-foreground">
            {{ $t('app.auth.resetPasswordSubtitle') }}
          </p>
        </div>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <label for="email">{{ $t('app.auth.email') }}</label>
            <Input type="email" v-model="email" id="email" :placeholder="$t('app.auth.email')" @input="validateEmail" />
            <p v-if="emailError" class="error-message">{{ emailError }}</p>
          </div>
          <Button @click="requestReset" :disabled="!isEmailValid" class="w-full">
            {{ $t('app.auth.resetPasswordTitle') }}
          </Button>
        </div>
        <div class="mt-4 text-center text-sm">
          <button class="underline" @click="navigateToLogin">
            {{ $t('app.auth.loginPrompt') }}
          </button>
        </div>
        <p class="infoMessage" v-if="message">{{ message }}</p>
      </div>
    </div>
    <div class="hidden bg-muted lg:block">
      <img src="../assets/authImage.png" alt="Image" width="1920" height="1080" class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'
import { authApi } from '@/api/config'
import type { ResetPasswordRequest } from '@/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'vue-router'

const email = ref('')
const emailError = ref<string | null>(null)
const isEmailValid = ref(false)
const message = ref('')
const router = useRouter()

const emailSchema = z.string().email()

const validateEmail = () => {
  try {
    emailSchema.parse(email.value)
    emailError.value = null
    isEmailValid.value = true
  } catch (e) {
    emailError.value = "Format d'email invalide"
    isEmailValid.value = false
  }
}

const requestReset = async () => {
  try {
    const resetRequest: ResetPasswordRequest = { email: email.value }
    const response = await authApi.resetPasswordRequest(resetRequest)
    message.value = response.data.message
  } catch (error) {
    console.error('Request reset failed:', error)
    message.value = 'An error occurred. Please try again.'
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
  text-align: center;
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 10px;
  display: block;
}

.infoMessage {
  color: #42b883;
  text-align: center;
}
</style>
