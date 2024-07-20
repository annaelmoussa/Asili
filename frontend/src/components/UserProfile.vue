<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { z } from 'zod'
import { useUserStore } from '@/stores/user'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import Toaster from '@/components/ui/toast/Toaster.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { authApi } from '@/api/config'
import type { UpdatePasswordRequest } from '@/api'

const userStore = useUserStore()

const { toast } = useToast()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const formErrors = ref<string[]>([])

const passwordSchema = z.string()
  .min(12, { message: "Le mot de passe doit contenir au moins 12 caractères" })
  .regex(/^(?=.*[a-z])/, { message: "Le mot de passe doit contenir au moins une lettre minuscule" })
  .regex(/^(?=.*[A-Z])/, { message: "Le mot de passe doit contenir au moins une lettre majuscule" })
  .regex(/^(?=.*\d)/, { message: "Le mot de passe doit contenir au moins un chiffre" })
  .regex(/^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, { message: "Le mot de passe doit contenir au moins un symbole" })

onMounted(() => {
  if (userStore.user) {
    email.value = userStore.user.email
  }
})

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

const updateEmail = async () => {
  try {
    console.log(email.value)
    await userStore.updateEmail(email.value)
    toast({
      title: "Success",
      description: "Email updated successfully.",
    })
  } catch (error) {
    console.error('Failed to update email:', error)
    toast({
      title: "Error",
      description: "Failed to update email. Please try again.",
      variant: "destructive",
    })
  }
}

const updatePassword = async () => {
  if (!isFormValid.value) return

  try {
    const changePasswordRequest: UpdatePasswordRequest = { token : userStore.token, password: password.value, confirm_password: confirmPassword.value }
    await authApi.resetPassword(changePasswordRequest)
    toast({
      title: "Success",
      description: "Password updated successfully.",
    })
    password.value = ''
    confirmPassword.value = ''
  } catch (error) {
    console.error('Failed to update password:', error)
    toast({
      title: "Error",
      description: "Failed to update password. Please try again.",
      variant: "destructive",
    })
  }
}

const deleteAccount = () => {
  toast({
    title: "Info",
    description: "Delete account functionality is not yet implemented.",
  })
}
</script>

<template>
  <div>
    <h3 class="text-lg font-medium">Profile</h3>
    <p class="text-sm text-muted-foreground">Manage your account settings.</p>
  </div>
  <Separator class="my-6" />

  <div class="space-y-6">
    <div>
      <h4 class="text-sm font-medium">Email</h4>
      <div class="flex mt-2">
        <Input v-model="email" type="email" placeholder="Your email" class="mr-2" />
        <Button @click="updateEmail">Update Email</Button>
      </div>
    </div>

    <div>
      <h4 class="text-sm font-medium">Change Password</h4>
      <div class="space-y-2 mt-2">
        <Input v-model="password" type="password" placeholder="New password" @input="validatePassword" />
        <Input v-model="confirmPassword" type="password" placeholder="Confirm new password" @input="validateConfirmPassword" />
        <div v-if="formErrors.length" class="text-red-500 text-sm error-list">
          <ul>
            <li v-for="error in formErrors" :key="error">{{ error }}</li>
          </ul>
        </div>
        <Button @click="updatePassword" :disabled="!isFormValid">Update Password</Button>
      </div>
    </div>

    <div>
      <h4 class="text-sm font-medium text-red-600">Danger Zone</h4>
      <div class="mt-2">
        <Button @click="deleteAccount" variant="destructive">Delete Account</Button>
      </div>
    </div>
  </div>

  <Toaster />
</template>

<style scoped>
.error-list ul {
  list-style-type: disc;
  padding-left: 1.5em;
  margin-top: 0.5em;
}

.error-list li {
  margin-bottom: 0.25em;
}
</style>