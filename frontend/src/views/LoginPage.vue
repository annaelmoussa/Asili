<template>
  <div class="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
    <div class="flex items-center justify-center py-12">
      <form class="auth-form" @submit.prevent="handleLogin">
        <div class="mx-auto grid w-[350px] gap-6">
          <div class="grid gap-2 text-center">
            <h1 class="text-3xl font-bold">
              {{ $t('app.auth.loginTitle') }}
            </h1>
            <p class="text-balance text-muted-foreground">
              {{ $t('app.auth.loginSubtitle') }}
            </p>
          </div>
          <div class="grid gap-4">
            <div class="grid gap-2">
              <label for="email">{{ $t('app.auth.email') }}</label>
              <Input type="email" v-model="email" id="email" :placeholder="$t('app.auth.email')" required />
            </div>
            <div class="grid gap-2">
              <div class="flex items-center">
                <Label for="password">{{ $t('app.auth.password') }}</Label>
                <a @click="navigateToResetPassword" class="ml-auto inline-block text-sm underline" style="cursor:pointer">
                  {{ $t('app.auth.forgotPassword') }}
                </a>
              </div>
              <Input type="password" v-model="password" id="password" :placeholder="$t('app.auth.password')" />
            </div>
            <Button @click="handleLogin" type="submit" class="w-full">
              {{ $t('app.auth.loginButton') }}
            </Button>
          </div>
          <div class="mt-4 text-center text-sm">
            {{ $t('app.auth.noAccountPrompt') }}
            <button class="underline" @click="navigateToSignup">
              {{ $t('app.auth.signupPrompt') }}
            </button>
          </div>
          <p v-if="message" class="error-message">{{ message }}</p>
          <Button v-if="message === 'Please confirm your email address'" @click="handleResendConfirmation">
            {{ $t('app.auth.ResendConfirmation') }}
          </Button>
        </div>
      </form>
    </div>
    <div class="hidden bg-muted lg:block">
      <img src="../assets/authImage.png" alt="Image" width="1920" height="1080" class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
    </div>
  </div>




  <!-- <div class="auth-container">
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
  </div> -->
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()
const userStore = useUserStore()
const message = computed(() => userStore.message);


const handleLogin = async () => {
  
  try {
    errorMessage.value = ''
    await userStore.login(email.value, password.value)
    
    if (!userStore.message) {
      router.push('/')
    }
  } catch (error) {
    
  }
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
body{
  overflow-y: hidden;
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 10px;
  display: block;
}
</style>
