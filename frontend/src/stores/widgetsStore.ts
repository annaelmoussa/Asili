import { defineStore } from 'pinia'
import { ref } from 'vue'
import { defaultApi, userApi, widgetsApi } from '@/api/config'
import { useUserStore } from '@/stores/user'
import type { GridStackWidget } from 'gridstack'

interface Widget {
  id: string
  title: string
  type: 'Area' | 'Line' | 'Bar' | 'Donut'
  data: any
  grid: Partial<GridStackWidget>
}

export const useWidgetsStore = defineStore('widgets', () => {
  const widgets = ref<Widget[]>([])
  const isLoading = ref(false)
  const userStore = useUserStore()

  const fetchWidgets = async () => {
    if (!userStore.hasScope('ROLE_ADMIN')) {
      throw new Error('User does not have the required scope to fetch widgets')
    }

    isLoading.value = true
    try {
      const response = await widgetsApi.getWidgets()
      widgets.value = response.data.map((widget) => ({
        id: widget.id ?? '',
        title: widget.name,
        type: widget.type as 'Area' | 'Line' | 'Bar' | 'Donut',
        data: widget.settings,
        grid: { x: widget.x, y: widget.y, w: widget.w, h: widget.h }
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
      const response = await widgetsApi.createWidget(
        {
          name: widget.title,
          type: widget.type,
          settings: widget.data,
          x: widget.grid.x ?? 0,
          y: widget.grid.y ?? 0,
          w: widget.grid.w ?? 2,
          h: widget.grid.h ?? 2,
          userId: userStore.user.id
        },
        { headers: { Authorization: `Bearer ${userStore.token}` } }
      )

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
      await widgetsApi.updateWidget(
        id,
        {
          name: widget.title,
          type: widget.type,
          settings: widget.data,
          x: widget.grid.x ?? 0,
          y: widget.grid.y ?? 0,
          w: widget.grid.w ?? 2,
          h: widget.grid.h ?? 2,
          userId: userStore.user.id
        },
        { headers: { Authorization: `Bearer ${userStore.token}` } }
      )
      const index = widgets.value.findIndex((w) => w.id === id)
      if (index !== -1) {
        widgets.value[index] = { ...widget }
      }
    } catch (error) {
      console.error('Failed to update widget:', error)
      throw error
    }
  }

  const fetchProductData = async () => {
    try {
      const response = await defaultApi.getProducts()
      return response.data
    } catch (error) {
      console.error('Failed to fetch products:', error)
      return []
    }
  }

  const fetchUserData = async () => {
    try {
      const response = await userApi.getAllUsers()
      return response.data
    } catch (error) {
      console.error('Failed to fetch users:', error)
      return []
    }
  }

  const transformProductDataForChart = (data: any[], chartType: string) => {
    switch (chartType) {
      case 'Area':
      case 'Bar':
      case 'Line':
        return {
          index: 'name',
          categories: ['price', 'stock'],
          data: data.map((item) => ({ name: item.name, price: item.price, stock: item.stock }))
        }
      case 'Donut':
        return {
          index: 'name',
          categories: ['price'],
          data: data.map((item) => ({ name: item.name, price: item.price }))
        }
      default:
        return { index: 'name', categories: [], data: [] }
    }
  }

  const transformUserDataForChart = (data: any[], chartType: string) => {
    switch (chartType) {
      case 'Area':
      case 'Bar':
        return {
          index: 'email',
          categories: ['role', 'isConfirmed'],
          data: data.map((item) => ({
            email: item.email,
            role: item.role === 'admin' ? 1 : 0,
            isConfirmed: item.isConfirmed ? 1 : 0
          }))
        }
      case 'Line':
        return {
          index: 'email',
          categories: ['isConfirmed'],
          data: data.map((item) => ({
            email: item.email,
            isConfirmed: item.isConfirmed ? 1 : 0
          }))
        }
      case 'Donut':
        return {
          index: 'email',
          categories: ['isConfirmed'],
          data: data.map((item) => ({
            email: item.email,
            isConfirmed: item.isConfirmed ? 1 : 0
          }))
        }
      default:
        return { index: 'email', categories: [], data: [] }
    }
  }

  return {
    widgets,
    isLoading,
    fetchWidgets,
    addWidget,
    removeWidget,
    updateWidget,
    fetchProductData,
    fetchUserData,
    transformProductDataForChart,
    transformUserDataForChart
  }
})
