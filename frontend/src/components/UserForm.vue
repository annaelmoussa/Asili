<template>
  <form @submit.prevent class="space-y-4">
    <div>
      <label class="block text-gray-700 text-sm font-bold mb-2" for="email">Email</label>
      <input
        id="email"
        v-model="formData.email"
        @input="$emit('update-field', 'email', $event.target.value)"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="email"
        placeholder="Email de l'utilisateur"
      />
      <p v-if="errors.email" class="text-red-500 text-xs italic">{{ errors.email }}</p>
    </div>

    <div>
      <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Mot de passe</label>
      <input
        id="password"
        v-model="formData.password"
        @input="$emit('update-field', 'password', $event.target.value)"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="password"
        placeholder="Mot de passe"
      />
      <p v-if="errors.password" class="text-red-500 text-xs italic">{{ errors.password }}</p>
    </div>

    <div>
      <label class="block text-gray-700 text-sm font-bold mb-2" for="role">Rôle</label>
      <select
        id="role"
        v-model="formData.role"
        @change="$emit('update-field', 'role', $event.target.value)"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      >
        <option value="">Sélectionnez un rôle</option>
        <option value="user">Utilisateur</option>
        <option value="admin">Administrateur</option>
      </select>
      <p v-if="errors.role" class="text-red-500 text-xs italic">{{ errors.role }}</p>
    </div>

    <div class="flex items-center">
      <input
        id="isConfirmed"
        v-model="formData.isConfirmed"
        @change="$emit('update-field', 'isConfirmed', $event.target.checked)"
        type="checkbox"
        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      <label for="isConfirmed" class="ml-2 block text-sm text-gray-900">Compte confirmé</label>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'UserForm',
  props: {
    formData: {
      type: Object as PropType<{
        email: string
        password: string
        role: string
        isConfirmed: boolean
      }>,
      required: true
    },
    errors: {
      type: Object as PropType<Record<string, string>>,
      required: true
    }
  },
  emits: ['update-field']
})
</script>
