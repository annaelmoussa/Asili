<template>
  <form @submit.prevent class="space-y-4">
    <div v-for="field in formFields" :key="field.name">
      <label :for="field.name" class="block text-gray-700 text-sm font-bold mb-2">{{
        field.label
      }}</label>
      <input
        v-if="field.type !== 'select' && field.type !== 'checkbox' && field.type !== 'textarea'"
        :id="field.name"
        :type="field.type"
        :value="formData[field.name]"
        @input="$emit('update-field', field.name, ($event.target as HTMLInputElement).value)"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        :placeholder="field.placeholder"
      />
      <textarea
        v-else-if="field.type === 'textarea'"
        :id="field.name"
        :value="formData[field.name]"
        @input="$emit('update-field', field.name, ($event.target as HTMLTextAreaElement).value)"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        :placeholder="field.placeholder"
      ></textarea>
      <select
        v-else-if="field.type === 'select'"
        :id="field.name"
        :value="formData[field.name]"
        @change="$emit('update-field', field.name, ($event.target as HTMLSelectElement).value)"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      >
        <option value="">Sélectionnez une option</option>
        <option v-for="option in field.options" :key="option.id" :value="option.id">
          {{ option.name }}
        </option>
      </select>
      <div v-else-if="field.type === 'checkbox'" class="flex items-center">
        <input
          :id="field.name"
          type="checkbox"
          :checked="formData[field.name]"
          @change="$emit('update-field', field.name, ($event.target as HTMLInputElement).checked)"
          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label :for="field.name" class="ml-2 block text-sm text-gray-900">{{ field.label }}</label>
      </div>
      <p v-if="errors[field.name]" class="text-red-500 text-xs italic">{{ errors[field.name] }}</p>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, computed, type PropType } from 'vue'
import type { ICategory, IBrand } from '@/api'

export default defineComponent({
  name: 'ProductForm',
  props: {
    formData: {
      type: Object as PropType<any>,
      required: true
    },
    errors: {
      type: Object as PropType<Record<string, string>>,
      required: true
    },
    categories: {
      type: Array as PropType<ICategory[]>,
      required: true
    },
    brands: {
      type: Array as PropType<IBrand[]>,
      required: true
    }
  },
  emits: ['update-field'],
  setup(props) {
    const formFields = computed(() => [
      { name: 'name', label: 'Nom', type: 'text', placeholder: 'Nom du produit' },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        placeholder: 'Description du produit'
      },
      { name: 'price', label: 'Prix', type: 'number', placeholder: 'Prix du produit' },
      { name: 'categoryId', label: 'Catégorie', type: 'select', options: props.categories },
      { name: 'brandId', label: 'Marque', type: 'select', options: props.brands },
      { name: 'stock', label: 'Stock', type: 'number', placeholder: 'Quantité en stock' },
      {
        name: 'image',
        label: "URL de l'image",
        type: 'text',
        placeholder: "URL de l'image du produit"
      },
      { name: 'isPromotion', label: 'En promotion', type: 'checkbox' }
    ])

    return {
      formFields
    }
  }
})
</script>
