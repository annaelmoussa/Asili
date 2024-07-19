<template>
  <CrudPanel
    title="Gestion des utilisateurs"
    itemName="utilisateur"
    addButtonText="Ajouter un utilisateur"
    :items="users"
    :columns="columns"
    :formSchema="userSchema"
    :initialFormData="initialData"
    :formTransformations="transformations"
    :apiActions="apiActions"
  >
    <template #form="{ formData, errors, updateField }">
      <UserForm :form-data="formData" :errors="errors" :update-field="updateField" />
    </template>
    <template #view="{ item }">
      <UserDetails :user="item" />
    </template>
  </CrudPanel>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { z } from 'zod'
import { userApi } from '@/api/config'
import type { IUser, PartialIUser } from '@/api'
import CrudPanel from '@/components/CrudPanel.vue'
import type { TableColumn } from '@/types/table'
import UserForm from '@/components/UserForm.vue'
import UserDetails from '@/components/UserDetails.vue'

interface TableItem {
  id: string | number
  [key: string]: any
}

export default defineComponent({
  name: 'PanelUsers',
  components: { CrudPanel, UserForm, UserDetails },
  setup() {
    const users = ref<TableItem[]>([])

    const columns: TableColumn[] = [
      { key: 'id', label: 'ID', sortable: true, type: 'text' },
      { key: 'email', label: 'Email', sortable: true, type: 'text' },
      { key: 'role', label: 'Rôle', sortable: true, type: 'text' },
      { key: 'isConfirmed', label: 'Confirmé', sortable: true, type: 'boolean' }
    ]

    const userSchema = z.object({
      email: z.string().email('Email invalide'),
      password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
      role: z.string().min(1, 'Le rôle est requis'),
      isConfirmed: z.boolean()
    })

    const initialData = {
      email: '',
      password: '',
      role: '',
      isConfirmed: false
    }

    const transformations = {
      isConfirmed: (value: string) => value === 'true'
    }

    const apiActions = {
      fetchItems: async () => {
        const response = await userApi.getAllUsers()
        users.value = response.data.map((user) => ({
          ...user,
          id: user.id || ''
        }))
      },
      createItem: async (data: Omit<IUser, 'id'>): Promise<void> => {
        await userApi.createUser(data)
      },
      updateItem: async (id: string, data: Partial<Omit<IUser, 'id'>>): Promise<void> => {
        await userApi.updateUser(id, data)
      },
      deleteItem: async (id: string): Promise<void> => {
        await userApi.deleteUser(id)
      }
    }

    onMounted(async () => {
      await apiActions.fetchItems()
    })

    return {
      users,
      columns,
      userSchema,
      initialData,
      transformations,
      apiActions
    }
  }
})
</script>
