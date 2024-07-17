<script setup lang="ts">
import { ref, computed } from 'vue'
import { z } from 'zod'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUserStore } from '@/stores/user'
import { authApi } from '@/api/config'

const router = useRouter()
const userStore = useUserStore()

const passwordSchema = z
  .string()
  .min(12, 'Le mot de passe doit contenir au moins 12 caractères')
  .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une lettre majuscule')
  .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une lettre minuscule')
  .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
  .regex(/[^A-Za-z0-9]/, 'Le mot de passe doit contenir au moins un symbole')

const password = ref('')
const confirmPassword = ref('')
const errors = ref<string[]>([])
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const passwordMismatch = computed(() => {
  return confirmPassword.value !== '' && password.value !== confirmPassword.value
})

function validatePassword() {
  errors.value = []
  try {
    passwordSchema.parse(password.value)
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.value = error.errors.map(err => err.message)
    }
  }
}

function togglePasswordVisibility(field: 'password' | 'confirmPassword') {
  if (field === 'password') {
    showPassword.value = !showPassword.value
  } else {
    showConfirmPassword.value = !showConfirmPassword.value
  }
}
console.log(userStore.token)
async function changePassword() {
  if (errors.value.length > 0 || passwordMismatch.value) {
    return
  }

  try {
    const changePasswordRequest: UpdatePasswordRequest = {token : userStore.token,password: password.value, confirm_password: confirmPassword.value };
    await authApi.resetPassword(changePasswordRequest);
    userStore.mustChangePassword = false;
    router.push('/');
  } catch (error) {
    console.error('Échec de la modification du mot de passe', error)
  }
}
</script>

<template>
  <div class="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
    <div class="flex items-center justify-center py-12">
      <div class="mx-auto grid w-[350px] gap-6">
        <div class="grid gap-2 text-center">
          <h1 class="text-3xl font-bold">Modifier son mot de passe</h1>
          <p class="text-balance text-muted-foreground">
            Pour des raisons de sécurité, veuillez modifier votre mot de passe.
          </p>
        </div>
        <form @submit.prevent="changePassword" class="grid gap-4">
          <div class="grid gap-2">
            <Label for="password">Mot de passe</Label>
            <div class="relative">
              <Input 
                id="password" 
                v-model="password" 
                :type="showPassword ? 'text' : 'password'" 
                required 
                @input="validatePassword" 
              />
              <button 
                type="button" 
                class="absolute right-2 top-1/2 -translate-y-1/2"
                @click="togglePasswordVisibility('password')"
              >
                👁️
              </button>
            </div>
          </div>
          <div class="grid gap-2">
            <Label for="confirm-password">Confirmer le mot de passe</Label>
            <div class="relative">
              <Input 
                id="confirm-password" 
                v-model="confirmPassword" 
                :type="showConfirmPassword ? 'text' : 'password'" 
                required 
              />
              <button 
                type="button" 
                class="absolute right-2 top-1/2 -translate-y-1/2"
                @click="togglePasswordVisibility('confirmPassword')"
              >
                👁️
              </button>
            </div>
          </div>
          <div v-if="errors.length > 0 || passwordMismatch" class="text-red-500">
            <ul>
              <li v-for="error in errors" :key="error">{{ error }}</li>
              <li v-if="passwordMismatch">Les mots de passe ne correspondent pas</li>
            </ul>
          </div>
          <div v-if="userStore.message" :class="{'text-green-500': !userStore.message.includes('erreur'), 'text-red-500': userStore.message.includes('erreur')}">
            {{ userStore.message }}
          </div>
          <Button type="submit" class="w-full" :disabled="errors.length > 0 || passwordMismatch">
            Modifier le mot de passe
          </Button>
        </form>
      </div>
    </div>
    <div class="hidden bg-muted lg:block">
      <img
        src="/src/assets/resetPassword.png"
        alt="Image"
        width="1920"
        height="1080"
        class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
      >
    </div>
  </div>
</template>