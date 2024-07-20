import axios from 'axios'
import router from '@/router'
import { useUserStore } from '@/stores/user'
import { useNotificationStore } from '@/stores/notification'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
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
    
    if (error.response) {
      notificationStore.showNotification(error.response.data.message || 'An error occurred', 'error')
    } else if (error.request) {
      notificationStore.showNotification('No response received from server', 'error')
    } else {
      notificationStore.showNotification('Error setting up the request', 'error')
    }

    if (error.response && error.response.status === 401) {
      console.log('Init user store')
      const userStore = useUserStore()
      userStore.clearUserData()
      console.log('Before after and redirect')
      router.push('/login')
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