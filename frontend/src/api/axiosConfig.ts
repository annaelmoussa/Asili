import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import router from '@/router'
import { useUserStore } from '@/stores/user'
import { useNotificationStore } from '@/stores/notification'

interface ApiErrorData {
  message?: string
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  withCredentials: true,
  timeout: 10000 // 10 seconds timeout
})

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('API response:', response)
    return response
  },
  async (error: AxiosError<ApiErrorData>) => {
    console.log('API error:', error)
    const notificationStore = useNotificationStore()
    const userStore = useUserStore()

    if (error.response) {
      const { status, data } = error.response

      // Handle different error statuses
      switch (status) {
        case 400:
          notificationStore.showNotification(
            data?.message || 'Bad request. Please check your input.',
            'error'
          )
          break
        case 401:
          if (data?.message === 'Password change required') {
            router.push('/change-password')
          } else {
            console.log('Unauthorized. Clearing user data.')
            // userStore.clearUserData()
            router.push('/login')
          }
          break
        case 403:
          notificationStore.showNotification(
            'You do not have permission to perform this action.',
            'error'
          )
          break
        case 404:
          notificationStore.showNotification('Resource not found.', 'error')
          break
        case 422:
          notificationStore.showNotification('Validation error. Please check your input.', 'error')
          break
        case 500:
          notificationStore.showNotification('Server error. Please try again later.', 'error')
          break
        default:
          notificationStore.showNotification(
            data?.message || 'An unexpected error occurred.',
            'error'
          )
      }
    } else if (error.request) {
      notificationStore.showNotification(
        'No response received from server. Please check your internet connection.',
        'error'
      )
    } else {
      notificationStore.showNotification('Error setting up the request. Please try again.', 'error')
    }

    // If the error was due to an expired token, try to refresh it
    if (error.response?.status === 401 && error.response?.data?.message === 'Token expired') {
      try {
        await userStore.refreshAuthToken()
        // Retry the original request
        const originalRequest = error.config
        if (originalRequest) {
          return api(originalRequest)
        }
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError)
        userStore.clearUserData()
        router.push('/login')
      }
    }

    return Promise.reject(error)
  }
)

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers['Authorization'] = `Bearer ${userStore.token}`
    }
    return config
  },
  (error: AxiosError) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

export default api
