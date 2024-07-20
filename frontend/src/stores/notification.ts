import { defineStore } from 'pinia'

type NotificationType = 'success' | 'info' | 'warn' | 'error'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    message: '',
    type: 'info' as NotificationType,
    visible: false
  }),
  actions: {
    showNotification(message: string, type: NotificationType = 'info') {
      this.message = message
      this.type = type
      this.visible = true
    },
    hideNotification() {
      this.visible = false
    }
  }
})
