import { defineStore } from 'pinia'
import { ref } from 'vue'
import { defaultApi, userApi, widgetsApi } from '@/api/config'
import { useUserStore } from '@/stores/user'
import type { GridStackWidget } from 'gridstack'
import type { WidgetCreationParams } from '@/api'

interface Widget {
  id: string
  title: string
  type: 'Area' | 'Line' | 'Bar' | 'Donut'
  data: any
  grid: Partial<GridStackWidget>
  modelType: 'Products' | 'Users' | 'Orders'
}

export const useWidgetsStore = defineStore('widgets', () => {
  const widgets = ref<Widget[]>([])
  const isLoading = ref(false)
  const userStore = useUserStore()

  const transformWidgetData = (widgetData: any, modelType: string) => {
    if (!widgetData) {
      console.error('Invalid widget data format:', widgetData)
      return { index: 'category', categories: ['value'], data: [] }
    }

    switch (modelType) {
      case 'Products': {
        const priceData = widgetData.priceDistribution.map((item: any) => ({
          category: `Price $${item._id}`,
          value: item.count
        }))
        const stockData = widgetData.stockLevels.map((item: any) => ({
          category: `Stock ${item._id}`,
          value: item.count
        }))
        return {
          index: 'category',
          categories: ['value'],
          data: [...priceData, ...stockData]
        }
      }
      case 'Users': {
        const roleData = widgetData.roleDistribution.map((item: any) => ({
          category: item.role,
          value: parseInt(item.count)
        }))
        const confirmationData = widgetData.confirmationStatus.map((item: any) => ({
          category: item.isConfirmed ? 'Confirmed' : 'Not Confirmed',
          value: parseInt(item.count)
        }))
        return {
          index: 'category',
          categories: ['value'],
          data: [...roleData, ...confirmationData]
        }
      }
      case 'Orders': {
        if (widgetData.revenueOverTime && widgetData.revenueOverTime.length > 0) {
          return {
            index: 'date',
            categories: ['revenue'],
            data: widgetData.revenueOverTime.map((item: any) => ({
              date: new Date(item.date).toLocaleDateString(),
              revenue: item.revenue
            }))
          }
        } else {
          return {
            index: 'category',
            categories: ['value'],
            data: [{ category: 'No Data', value: 0 }]
          }
        }
      }
      default:
        return { index: 'category', categories: ['value'], data: [] }
    }
  }

  const fetchWidgets = async () => {
    if (!userStore.hasScope('ROLE_ADMIN')) {
      throw new Error('User does not have the required scope to fetch widgets')
    }

    isLoading.value = true
    try {
      const response = await widgetsApi.getWidgets()
      widgets.value = response.data.map((widget: any) => ({
        id: widget.id ?? '',
        title: widget.name,
        type: widget.type as 'Area' | 'Line' | 'Bar' | 'Donut',
        data: widget.settings,
        grid: { x: widget.x, y: widget.y, w: widget.w, h: widget.h },
        modelType: widget.modelType as 'Products' | 'Users' | 'Orders'
      }))
    } catch (error) {
      console.error('Failed to fetch widgets:', error)
    } finally {
      isLoading.value = false
    }
  }

  const addWidget = async (widget: Omit<Widget, 'id'>) => {
    if (!userStore.user) {
      throw new Error('User is not authenticated')
    }

    if (!userStore.user.id) {
      throw new Error('User ID is undefined')
    }

    if (!userStore.hasScope('ROLE_ADMIN')) {
      throw new Error('User does not have the required scope to create widgets')
    }

    try {
      const widgetCreationParams: WidgetCreationParams = {
        name: widget.title,
        type: widget.type,
        settings: widget.data,
        x: widget.grid.x ?? 0,
        y: widget.grid.y ?? 0,
        w: widget.grid.w ?? 2,
        h: widget.grid.h ?? 2,
        userId: userStore.user.id,
        modelType: widget.modelType
      }

      const response = await widgetsApi.createWidget(widgetCreationParams, {
        headers: { Authorization: `Bearer ${userStore.token}` }
      })

      const newWidget: Widget = {
        ...widget,
        id: response.data.id ?? ''
      }

      if (!widgets.value.some((w) => w.id === newWidget.id)) {
        widgets.value.push(newWidget)
      }

      return newWidget
    } catch (error) {
      console.error('Failed to add widget:', error)
      throw error
    }
  }

  const removeWidget = async (id: string) => {
    if (!userStore.hasScope('ROLE_ADMIN')) {
      throw new Error('User does not have the required scope to delete widgets')
    }

    try {
      await widgetsApi.deleteWidget(id, {
        headers: { Authorization: `Bearer ${userStore.token}` }
      })
      widgets.value = widgets.value.filter((widget) => widget.id !== id)
    } catch (error) {
      console.error('Failed to remove widget:', error)
      throw error
    }
  }

  const updateWidget = async (id: string, widget: Widget) => {
    if (!userStore.user) {
      throw new Error('User is not authenticated')
    }

    if (!userStore.user.id) {
      throw new Error('User ID is undefined')
    }

    if (!userStore.hasScope('ROLE_ADMIN')) {
      throw new Error('User does not have the required scope to update widgets')
    }

    try {
      const widgetCreationParams: WidgetCreationParams = {
        name: widget.title,
        type: widget.type,
        settings: widget.data,
        x: widget.grid.x ?? 0,
        y: widget.grid.y ?? 0,
        w: widget.grid.w ?? 2,
        h: widget.grid.h ?? 2,
        userId: userStore.user.id,
        modelType: widget.modelType
      }

      await widgetsApi.updateWidget(id, widgetCreationParams, {
        headers: { Authorization: `Bearer ${userStore.token}` }
      })

      const index = widgets.value.findIndex((w) => w.id === id)
      if (index !== -1) {
        widgets.value[index] = { ...widget }
      }
    } catch (error) {
      console.error('Failed to update widget:', error)
      throw error
    }
  }

  const fetchWidgetData = async (modelType: string) => {
    try {
      const response = await widgetsApi.getWidgetData(modelType)
      return response.data
    } catch (error) {
      console.error(`Failed to fetch ${modelType} data:`, error)
      return {}
    }
  }

  return {
    widgets,
    isLoading,
    fetchWidgets,
    addWidget,
    removeWidget,
    updateWidget,
    fetchWidgetData,
    transformWidgetData
  }
})
