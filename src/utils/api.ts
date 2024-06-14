import { useAuthStore } from '@/stores/AuthStore'
import { useEchoStore } from '@/stores/EchoStore'
import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error): Promise<never> => {
    if (error.response?.status === 401) {
      const EchoStore = useEchoStore()
      const authStore = useAuthStore()
      const { user } = storeToRefs(authStore)
      const router = useRouter()

      EchoStore.leave()
      user.value = null
      localStorage.removeItem('user')
      router.push({ name: 'home' })
    }
    return Promise.reject(error)
  }
)

export default api
