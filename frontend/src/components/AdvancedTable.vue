<template>
  <div class="advanced-table">
    <div class="table-controls">
      <div class="search">
        <input v-model="searchQuery" @input="handleSearch" placeholder="Rechercher..." />
      </div>
      <div class="actions">
        <button @click="exportCSV" :disabled="!hasSelectedItems">Exporter CSV</button>
        <button @click="deleteSelected" :disabled="!hasSelectedItems">Supprimer sélection</button>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>
            <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll" />
          </th>
          <th
            v-for="column in columns"
            :key="column.key"
            @click="sortBy(column.key)"
            :class="{ sortable: column.sortable }"
          >
            {{ column.label }}
            <span v-if="sortKey === column.key" class="sort-indicator">
              {{ sortOrder === 'asc' ? '▲' : '▼' }}
            </span>
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginatedData" :key="item.id">
          <td>
            <input type="checkbox" :checked="isSelected(item.id)" @change="toggleSelect(item.id)" />
          </td>
          <td v-for="column in columns" :key="column.key">
            {{ item[column.key] }}
          </td>
          <td class="actions">
            <button @click="viewItem(item)">Visualiser</button>
            <button @click="editItem(item)">Éditer</button>
            <button @click="deleteItem(item)">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button @click="changePage(-1)" :disabled="isFirstPage">Précédent</button>
      <span>Page {{ currentPage }} sur {{ totalPages }}</span>
      <button @click="changePage(1)" :disabled="isLastPage">Suivant</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType, computed, ref, watch } from 'vue'
import debounce from 'lodash/debounce'

interface TableColumn {
  key: string
  label: string
  sortable: boolean
}

interface TableItem {
  id: string | number
  [key: string]: any
}

export default defineComponent({
  name: 'AdvancedTable',
  props: {
    data: {
      type: Array as PropType<TableItem[]>,
      required: true
    },
    columns: {
      type: Array as PropType<TableColumn[]>,
      required: true
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
      let result = props.data
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter((item) =>
          Object.values(item).some((value) => String(value).toLowerCase().includes(query))
        )
      }
      return result
    })

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
      const start = (currentPage.value - 1) * props.itemsPerPage
      const end = start + props.itemsPerPage
      return sortedData.value.slice(start, end)
    })

    const totalPages = computed(() => Math.ceil(filteredData.value.length / props.itemsPerPage))

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
    const deleteItem = (item: TableItem) => emit('delete', item)
    const deleteSelected = () => emit('delete-selected', Array.from(selectedItems.value))

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
      deleteSelected
    }
  }
})
</script>

<style scoped>
.advanced-table {
  /* Ajoutez vos styles ici */
}
</style>
