<template>
  <div class="space-y-4">
    <p><strong>ID:</strong> {{ user.id }}</p>
    <p><strong>Email:</strong> {{ user.email }}</p>
    <p><strong>Rôle:</strong> {{ user.role }}</p>
    <p><strong>Confirmé:</strong> {{ user.isConfirmed ? 'Oui' : 'Non' }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import type { IUser } from '@/api'

export default defineComponent({
  name: 'UserDetails',
  props: {
    user: {
      type: Object as PropType<IUser>,
      required: true
    }
  }
})
</script>
