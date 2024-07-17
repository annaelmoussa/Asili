<template>
  <form @submit.prevent class="space-y-4">
    <div>
      <label class="block text-gray-700 text-sm font-bold mb-2" for="name">Nom</label>
      <input
        id="name"
        v-model="formData.name"
        @input="$emit('update-field', 'name', $event.target.value)"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="text"
        placeholder="Nom de la catégorie"
      />
      <p v-if="errors.name" class="text-red-500 text-xs italic">{{ errors.name }}</p>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import type { PartialICategory } from '@/api'

export default defineComponent({
  name: 'CategoryForm',
  props: {
    formData: {
      type: Object as PropType<PartialICategory>,
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
