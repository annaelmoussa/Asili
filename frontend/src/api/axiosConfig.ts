// axiosConfig.ts
import axios from 'axios'
import router from '@/router'
import { useUserStore } from '@/stores/user'

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
    if (error.response.data.message === "Password change required") {
      router.push('/change-password');
    } else {
      router.push('/login');
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
