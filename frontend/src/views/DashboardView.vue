<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <div class="mb-4 flex">
      <select v-model="selectedDataType" class="mr-4 px-4 py-2 border rounded">
        <option value="Products">Products</option>
        <option value="Users">Users</option>
      </select>
      <select v-model="selectedChartType" class="mr-4 px-4 py-2 border rounded">
        <option value="Area">Area Chart</option>
        <option value="Line">Line Chart</option>
        <option value="Bar">Bar Chart</option>
        <option value="Donut">Donut Chart</option>
      </select>
      <button @click="addWidget" class="px-4 py-2 bg-green-500 text-white rounded">
        Add Widget
      </button>
      <button @click="toggleEditMode" class="ml-4 px-4 py-2 bg-blue-500 text-white rounded">
        {{ editMode ? 'Save Changes' : 'Edit Widgets' }}
      </button>
    </div>

    <div class="grid-stack"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, h, createApp, nextTick } from 'vue'
import { useWidgetsStore } from '@/stores/widgetsStore'
import { GridStack, type GridItemHTMLElement, type GridStackWidget } from 'gridstack'
import 'gridstack/dist/gridstack.min.css'
import 'gridstack/dist/gridstack-extra.min.css'
import ChartArea from '@/components/ChartArea.vue'
import ChartLine from '@/components/ChartLine.vue'
import ChartBar from '@/components/ChartBar.vue'
import ChartDonut from '@/components/ChartDonut.vue'
import { storeToRefs } from 'pinia'
import DeleteButton from '@/components/DeleteButton.vue'

const grid = ref<GridStack | undefined>(undefined)
const selectedChartType = ref<'Area' | 'Line' | 'Bar' | 'Donut'>('Area')
const selectedDataType = ref<'Products' | 'Users'>('Products')
const editMode = ref(false)

const chartComponents: Record<'Area' | 'Line' | 'Bar' | 'Donut' | 'DeleteButton', any> = {
  Area: ChartArea,
  Line: ChartLine,
  Bar: ChartBar,
  Donut: ChartDonut,
  DeleteButton: DeleteButton
}

const widgetsStore = useWidgetsStore()
const { widgets, isLoading } = storeToRefs(widgetsStore)

onMounted(async () => {
  grid.value = GridStack.init({
    column: 12,
    cellHeight: 100,
    margin: 10,
    disableResize: true,
    disableDrag: true
  })

  await widgetsStore.fetchWidgets()

  await nextTick()

  makeWidgets(widgetsStore.widgets)
})

watch(
  widgets,
  () => {
    makeWidgets(widgetsStore.widgets)
  },
  { deep: true }
)

const makeWidgets = (widgets: Array<Widget>) => {
  grid.value?.removeAll()
  widgets.forEach((widget) => {
    makeWidget(widget)
  })
}

const generateKey = () => {
  return Math.random().toString(36).substring(2, 11)
}

const makeWidget = async (item: Widget) => {
  const el = document.createElement('div') as GridItemHTMLElement
  el.classList.add('grid-stack-item')
  el.setAttribute('data-widget-id', item.id)

  el.innerHTML = `
    <div class="grid-stack-item-content p-4 bg-white rounded-md shadow-md">
      <div class="flex justify-between items-center">
        <span>${item.title}</span>
        <div id="delete-button-${item.id}"></div>
      </div>
      <div class="chart-container" id="chart-${item.id}" style="width: 100%; height: 300px;"></div>
    </div>`
  el.querySelector('.remove-widget')?.addEventListener('click', () => removeWidget(item.id))
  grid.value?.addWidget(el, item.grid)

  await nextTick()

  const deleteButtonContainer = el.querySelector(`#delete-button-${item.id}`)
  if (deleteButtonContainer) {
    const deleteButtonApp = createApp({
      render: () =>
        h(DeleteButton, {
          buttonText: 'Supprimer',
          confirmationMessage: 'Êtes-vous sûr de vouloir supprimer ce widget ?',
          onDelete: () => removeWidget(item.id),
          onSuccess: () => {
            console.log('Widget supprimé avec succès')
          }
        })
    })
    deleteButtonApp.mount(deleteButtonContainer)
  }

  const chartContainer = el.querySelector(`#chart-${item.id}`)
  if (chartContainer) {
    const ChartComponent = chartComponents[item.type]
    if (ChartComponent) {
      let props: Record<string, any> = {
        data: item.data.data,
        index: item.data.index,
        categories: item.data.categories,
        colors: ['#10b981', '#3b82f6'],
        keyElement: generateKey()
      }

      if (item.type === 'Donut') {
        props.category = item.data.categories[0]
        delete props.categories
      }

      const app = createApp({
        render: () => h(ChartComponent, props)
      })
      app.mount(chartContainer)
    }
  }
}

const addWidget = async () => {
  let data
  if (selectedDataType.value === 'Products') {
    const rawData = await widgetsStore.fetchProductData()
    data = widgetsStore.transformProductDataForChart(rawData, selectedChartType.value)
  } else {
    const rawData = await widgetsStore.fetchUserData()
    data = widgetsStore.transformUserDataForChart(rawData, selectedChartType.value)
  }

  const widget = {
    title: `Widget ${widgetsStore.widgets.length + 1}`,
    type: selectedChartType.value,
    data: data,
    grid: { x: 0, y: 0, w: 2, h: 2 }
  }

  try {
    const newWidget = await widgetsStore.addWidget(widget)
    if (newWidget) {
      await nextTick()
      if (!document.querySelector(`[data-widget-id="${newWidget.id}"]`)) {
        await makeWidget(newWidget)
      }
    }
  } catch (error) {
    console.error('Failed to add widget:', error)
  }
}

const removeWidget = async (id: string) => {
  console.log('Removing widget:', id)
  try {
    await widgetsStore.removeWidget(id)
    const el = document.querySelector(
      `.grid-stack-item[data-widget-id="${id}"]`
    ) as GridItemHTMLElement | null
    if (el) {
      grid.value?.removeWidget(el)
    }
    console.log('Widget removed successfully')
  } catch (error) {
    console.error('Failed to remove widget:', error)
    throw error // Propager l'erreur pour que DeleteButton puisse la gérer
  }
}

const saveWidgets = async () => {
  const serializedWidgets = grid.value?.engine.nodes
    .map((node) => {
      const widgetId = node.el?.getAttribute('data-widget-id')
      const widget = widgets.value.find((w) => w.id === widgetId)
      if (widget) {
        return {
          ...widget,
          grid: {
            x: node.x,
            y: node.y,
            w: node.w,
            h: node.h
          }
        }
      }
      return null
    })
    .filter((widget) => widget !== null) as Array<Widget>

  if (serializedWidgets) {
    localStorage.setItem('widgets', JSON.stringify(serializedWidgets))
    for (const widget of serializedWidgets) {
      await widgetsStore.updateWidget(widget.id, widget)
    }
  }
}

const toggleEditMode = async () => {
  console.log('Toggling edit mode...')
  editMode.value = !editMode.value
  if (editMode.value) {
    console.log('Enabling grid...')
    grid.value?.enableMove(true)
    grid.value?.enableResize(true)
  } else {
    console.log('Disabling grid...')
    grid.value?.disable()
    try {
      console.log('Saving widgets...')
      await saveWidgets()
      console.log('Widgets saved successfully')
    } catch (error) {
      console.error('Failed to save widgets:', error)
    }
  }
}

interface Widget {
  id: string
  title: string
  type: 'Area' | 'Line' | 'Bar' | 'Donut'
  data: any
  grid: Partial<GridStackWidget>
}
</script>

<style scoped>
.grid-stack-item-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.chart-container {
  width: 100%;
  height: 300px;
}
</style>

<style scoped>
.grid-stack-item-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.chart-container {
  width: 100%;
  height: 300px;
}
</style>
