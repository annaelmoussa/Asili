import { defineStore } from 'pinia'
import { ref } from 'vue'
import { WidgetsApi, Configuration, type IWidget, type WidgetCreationParams } from '@/api'

const configuration = new Configuration({
  basePath: 'http://localhost:3000'
})

const widgetsApi = new WidgetsApi(configuration)

export const useWidgetsStore = defineStore('widgets', () => {
  const widgets = ref<IWidget[]>([])

  const fetchWidgets = async (): Promise<void> => {
    try {
      const response = await widgetsApi.getWidgets()
      widgets.value = response.data
    } catch (error) {
      console.error('Failed to fetch widgets:', error)
    }
  }

  const createWidget = async (widget: WidgetCreationParams): Promise<void> => {
    try {
      const response = await widgetsApi.createWidget(widget)
      widgets.value.push(response.data)
    } catch (error) {
      console.error('Failed to create widget:', error)
    }
  }

  return {
    widgets,
    fetchWidgets,
    createWidget
  }
})
