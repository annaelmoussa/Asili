<template>
  <div class="advanced-table bg-white shadow-lg rounded-lg overflow-hidden">
    <div
      class="table-controls p-4 bg-gray-50 border-b border-gray-200 flex flex-wrap justify-between items-center"
    >
      <div class="search mb-2 sm:mb-0">
        <input
          v-model="searchQuery"
          @input="handleSearch"
          placeholder="Rechercher..."
          class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="actions space-x-2">
        <button
          @click="exportCSV"
          :disabled="!hasSelectedItems"
          class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Exporter CSV
        </button>
        <DeleteButton
          :confirmationMessage="`Êtes-vous sûr de vouloir supprimer ${selectedItems.size} éléments ?`"
          :onDelete="deleteSelected"
          @success="handleDeleteSuccess"
          :disabled="!hasSelectedItems"
          :button-text="`Supprimer (${selectedItems.size})`"
        />
      </div>
    </div>

    <div class="overflow-x-auto" v-if="paginatedData.length > 0">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="p-4 w-4">
              <input
                type="checkbox"
                :checked="isAllSelected"
                @change="toggleSelectAll"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </th>
            <th
              v-for="column in columns"
              :key="column.key"
              @click="sortBy(column.key)"
              :class="[
                'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer',
                { 'text-blue-500': sortKey === column.key }
              ]"
            >
              {{ column.label }}
              <span v-if="sortKey === column.key" class="ml-1">
                {{ sortOrder === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="item in paginatedData" :key="item.id" class="hover:bg-gray-50">
            <td class="p-4 w-4">
              <input
                type="checkbox"
                :checked="isSelected(item.id)"
                @change="toggleSelect(item.id)"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </td>
            <td v-for="column in columns" :key="column.key" class="px-6 py-4 whitespace-nowrap">
              <div v-if="column.type === 'image'" class="flex items-center">
                <img
                  :src="extractImageUrl(item[column.key as keyof typeof item])"
                  :alt="column.label"
                  class="h-10 w-10 rounded-full object-cover"
                  loading="lazy"
                  @error="handleImageError"
                />
              </div>
              <div v-else-if="column.type === 'boolean'" class="text-sm text-gray-900">
                {{ item[column.key as keyof typeof item] ? 'Oui' : 'Non' }}
              </div>
              <div v-else class="text-sm text-gray-900">
                {{ item[column.key as keyof typeof item] }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 flex">
              <button @click="viewItem(item)" class="text-blue-600 hover:text-blue-900">
                <Eye />
              </button>
              <button @click="editItem(item)" class="text-indigo-600 hover:text-indigo-900">
                <Pencil />
              </button>
              <DeleteButton
                :use-icon="true"
                :confirmationMessage="`Êtes-vous sûr de vouloir supprimer ${(item as any).name} ?`"
                :onDelete="() => deleteItem(item)"
                @success="handleDeleteSuccess"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="p-4 text-center text-gray-500">Aucune donnée disponible</div>

    <div
      class="pagination bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
    >
      <div class="flex-1 flex justify-between sm:hidden">
        <button
          @click="changePage(-1)"
          :disabled="isFirstPage"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Précédent
        </button>
        <button
          @click="changePage(1)"
          :disabled="isLastPage"
          class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Suivant
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700" v-if="filteredData && filteredData.length > 0">
            Affichage de
            <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> à
            <span class="font-medium">{{
              Math.min(currentPage * itemsPerPage, filteredData.length)
            }}</span>
            sur <span class="font-medium">{{ filteredData.length }}</span> résultats
          </p>
          <p class="text-sm text-gray-700" v-else-if="filteredData && filteredData.length === 0">
            Aucun résultat trouvé
          </p>
        </div>
        <div>
          <nav
            class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              @click="changePage(-1)"
              :disabled="isFirstPage"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span class="sr-only">Précédent</span>
              <svg
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
            <span
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
            >
              Page {{ currentPage }} sur {{ totalPages }}
            </span>
            <button
              @click="changePage(1)"
              :disabled="isLastPage"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span class="sr-only">Suivant</span>
              <svg
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType, computed, ref, watch } from 'vue'
import debounce from 'lodash/debounce'
import DeleteButton from './DeleteButton.vue'
import { extractImageUrl, formatPrice } from '@/utils/productUtils'
import { Eye, Pencil } from 'lucide-vue-next'

interface TableColumn {
  key: string
  label: string
  sortable: boolean
  type?: 'text' | 'image' | 'date' | 'boolean'
}

interface TableItem {
  id: string | number
  [key: string]: any
}

export default defineComponent({
  name: 'AdvancedTable',
  components: {
    DeleteButton,
    Eye,
    Pencil
  },
  props: {
    data: {
      type: Array as PropType<TableItem[]>,
      required: true,
      default: () => []
    },
    columns: {
      type: Array as PropType<TableColumn[]>,
      required: true,
      default: () => []
    },
    itemsPerPage: {
      type: Number,
      default: 10
    }
  },
  emits: ['view', 'edit', 'delete', 'delete-selected'],
  setup(props, { emit }) {
    const sortKey = ref('')
    const sortOrder = ref<'asc' | 'desc'>('asc')
    const searchQuery = ref('')
    const currentPage = ref(1)
    const selectedItems = ref<Set<string | number>>(new Set())

    const filteredData = computed(() => {
      if (!props.data) return []
      let result = props.data
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter((item) =>
          Object.values(item).some((value) => String(value).toLowerCase().includes(query))
        )
      }
      return result
    })

    const handleImageError = (event: Event) => {
      const target = event.target as HTMLImageElement
      target.src =
        'https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ='
    }

    const sortedData = computed(() => {
      if (!sortKey.value) return filteredData.value

      return [...filteredData.value].sort((a, b) => {
        const aValue = a[sortKey.value]
        const bValue = b[sortKey.value]
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortOrder.value === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue)
        }
        return sortOrder.value === 'asc' ? aValue - bValue : bValue - aValue
      })
    })

    const paginatedData = computed(() => {
      if (!sortedData.value || sortedData.value.length === 0) return []
      const start = (currentPage.value - 1) * props.itemsPerPage
      const end = start + props.itemsPerPage
      return sortedData.value.slice(start, end).map((item) => ({
        ...item,
        image: extractImageUrl(item.image),
        price: typeof item.price === 'number' ? formatPrice(item.price) : item.price
      }))
    })

    const totalPages = computed(() => {
      return filteredData.value && filteredData.value.length > 0
        ? Math.ceil(filteredData.value.length / props.itemsPerPage)
        : 1
    })

    const isFirstPage = computed(() => currentPage.value === 1)
    const isLastPage = computed(() => currentPage.value === totalPages.value)

    const isAllSelected = computed(() =>
      paginatedData.value.every((item) => selectedItems.value.has(item.id))
    )

    const hasSelectedItems = computed(() => selectedItems.value.size > 0)

    const handleSearch = debounce(() => {
      currentPage.value = 1
    }, 300)

    const sortBy = (key: string) => {
      if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
      } else {
        sortKey.value = key
        sortOrder.value = 'asc'
      }
    }

    const changePage = (delta: number) => {
      currentPage.value = Math.max(1, Math.min(currentPage.value + delta, totalPages.value))
    }

    const toggleSelectAll = () => {
      if (isAllSelected.value) {
        paginatedData.value.forEach((item) => selectedItems.value.delete(item.id))
      } else {
        paginatedData.value.forEach((item) => selectedItems.value.add(item.id))
      }
    }

    const toggleSelect = (id: string | number) => {
      if (selectedItems.value.has(id)) {
        selectedItems.value.delete(id)
      } else {
        selectedItems.value.add(id)
      }
    }

    const isSelected = (id: string | number) => selectedItems.value.has(id)

    const exportCSV = () => {
      const itemsToExport = props.data.filter((item) =>
        hasSelectedItems.value ? selectedItems.value.has(item.id) : true
      )

      const csv = [
        props.columns.map((col) => col.label).join(','),
        ...itemsToExport.map((item) => props.columns.map((col) => item[col.key]).join(','))
      ].join('\n')

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'export.csv'
      link.click()
      URL.revokeObjectURL(link.href)
    }

    const viewItem = (item: TableItem) => emit('view', item)
    const editItem = (item: TableItem) => emit('edit', item)
    const deleteItem = async (item: TableItem): Promise<void> => {
      await emit('delete', item)
    }
    const deleteSelected = async (): Promise<void> => {
      await emit('delete-selected', Array.from(selectedItems.value))
    }

    const handleDeleteSuccess = () => {
      // Logique à exécuter après une suppression réussie
      // Par exemple, rafraîchir les données
      // Vous pouvez émettre un événement ou appeler une fonction pour mettre à jour les données
    }

    watch(
      () => props.data,
      () => {
        currentPage.value = 1
        selectedItems.value.clear()
      }
    )

    return {
      sortKey,
      sortOrder,
      searchQuery,
      currentPage,
      selectedItems,
      paginatedData,
      totalPages,
      isFirstPage,
      isLastPage,
      isAllSelected,
      hasSelectedItems,
      handleSearch,
      sortBy,
      changePage,
      toggleSelectAll,
      toggleSelect,
      isSelected,
      exportCSV,
      viewItem,
      editItem,
      deleteItem,
      deleteSelected,
      extractImageUrl,
      handleImageError,
      filteredData,
      handleDeleteSuccess
    }
  }
})
</script>
