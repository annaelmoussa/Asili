<template>
  <div class="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
    <div class="flex items-center justify-center py-12">
      <div class="mx-auto grid w-[350px] gap-6">
        <div class="grid gap-2 text-center">
          <h1 class="text-3xl font-bold">
            {{ $t('app.auth.resetPasswordTitle') }}
          </h1>
        </div>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label for="password">{{ $t('app.auth.password') }}</Label>
            </div>      
            <Input type="password" v-model="password" id="password" :placeholder="$t('app.auth.password')" @input="validatePassword"/>
          </div>
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label for="confirmPassword">{{ $t('app.auth.confirmPassword') }}</Label>
            </div>      
            <Input type="password" v-model="confirmPassword" id="confirmPassword" :placeholder="$t('app.auth.confirmPassword')" @input="validateConfirmPassword"/>
          </div>
          <div v-if="formErrors.length" class="text-red-500 text-sm error-list">
            <ul>
              <li v-for="error in formErrors" :key="error">{{ error }}</li>
            </ul>
          </div>
          <Button @click="requestReset" type="submit" class="w-full" :disabled="!isFormValid">
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
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { z } from 'zod'
import { authApi } from '@/api/config'
import type { UpdatePasswordRequest } from '@/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const router = useRouter()
const route = useRoute()
const password = ref('')
const confirmPassword = ref('')
const formErrors = ref<string[]>([])
const message = ref('')
const token = route.query.token as string

const passwordSchema = z.string()
  .min(12, { message: "Le mot de passe doit contenir au moins 12 caractères" })
  .regex(/^(?=.*[a-z])/, { message: "Le mot de passe doit contenir au moins une lettre minuscule" })
  .regex(/^(?=.*[A-Z])/, { message: "Le mot de passe doit contenir au moins une lettre majuscule" })
  .regex(/^(?=.*\d)/, { message: "Le mot de passe doit contenir au moins un chiffre" })
  .regex(/^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, { message: "Le mot de passe doit contenir au moins un symbole" })

const validatePassword = () => {
  try {
    passwordSchema.parse(password.value)
    formErrors.value = formErrors.value.filter(error => !error.includes("mot de passe"))
  } catch (error) {
    if (error instanceof z.ZodError) {
      const passwordErrors = error.errors.map(err => err.message)
      formErrors.value = [...new Set([...formErrors.value.filter(error => !error.includes("mot de passe")), ...passwordErrors])]
    }
  }
  validateConfirmPassword()
}

const validateConfirmPassword = () => {
  if (password.value !== confirmPassword.value) {
    const confirmError = "Les mots de passe ne correspondent pas"
    if (!formErrors.value.includes(confirmError)) {
      formErrors.value.push(confirmError)
    }
  } else {
    formErrors.value = formErrors.value.filter(error => error !== "Les mots de passe ne correspondent pas")
  }
}

const isFormValid = computed(() => {
  return password.value && confirmPassword.value && formErrors.value.length === 0
})

const requestReset = async () => {
  if (!isFormValid.value) return

  try {
    const changePasswordRequest: UpdatePasswordRequest = { token, password: password.value, confirm_password: confirmPassword.value }
    await authApi.resetPassword(changePasswordRequest)
    router.push('/login')
  } catch (error) {
    console.error('Change password failed', error)
  }
}

const navigateToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.error-list ul {
  list-style-type: disc;
  padding-left: 1.5em;
  margin-top: 0.5em;
}

.error-list li {
  margin-bottom: 0.25em;
}

.infoMessage {
  color: #42b883;
  text-align: center;
}
</style>
