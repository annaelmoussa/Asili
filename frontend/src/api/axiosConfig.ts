// axiosConfig.ts
import axios from 'axios'
import router from '@/router'
import { useUserStore } from '@/stores/user'
import { useNotificationStore } from '@/stores/notification'

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true
})

api.interceptors.response.use(
  (response) => {
    console.log('API response:', response)
    return response
  },
  (error) => {
    console.log('API error:', error)
    const notificationStore = useNotificationStore()
    const userStore = useUserStore()

    if (error.response) {
      notificationStore.showNotification(
        error.response.data.message || 'An error occurred',
        'error'
      )

      if (error.response.data.message === 'Password change required') {
        router.push('/change-password')
      } else if (error.response.status === 401) {
        console.log('Init user store')
        userStore.clearUserData()
        console.log('Before after and redirect')
        router.push('/login')
      }
    } else if (error.request) {
      notificationStore.showNotification('No response received from server', 'error')
    } else {
      notificationStore.showNotification('Error setting up the request', 'error')
    }

    return Promise.reject(error)
  }
)

api.interceptors.request.use((config) => {
  const userStore = useUserStore()
  if (userStore.token) {
    config.headers['Authorization'] = `Bearer ${userStore.token}`
  }
  return config
})

export default api
