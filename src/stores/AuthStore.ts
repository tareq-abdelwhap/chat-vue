import api from '@/utils/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useEchoStore } from './EchoStore'

interface User {
  id?: number
  name?: string
  email: string
  selected?: boolean
  typing?: boolean
  online?: boolean
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user')!))
  const loading = ref(false)
  const errors = ref<{ [key: string]: string } | null>(null)

  const EchoStore = useEchoStore()

  const csrf = async () => {
    const { data } = await api.get('/auth/csrf-token')
    api.defaults.headers.common['X-CSRF-TOKEN'] = data.csrf_token
    return data.csrf_token
  }

  const setUser = async () => {
    try {
      const { data } = await api.get('/auth/user')

      user.value = data.user
      localStorage.setItem('user', JSON.stringify(data.user))
      EchoStore.onlineStatus()
    } catch (e: any) {
      errors.value = e.response.data.errors
    }
  }

  const handleLogin = async (payload: User) => {
    try {
      loading.value = true
      errors.value = null
      await csrf()
      await api.post('/auth/login', payload)
      await setUser()
    } catch (e: any) {
      errors.value = e.response.data.errors
    } finally {
      loading.value = false
    }
  }
  const handleRegister = async (payload: User) => {
    try {
      loading.value = true
      await csrf()
      errors.value = null
      await api.post('/auth/register', payload)
      await setUser()
    } catch (e: any) {
      errors.value = e.response.data.errors
    } finally {
      loading.value = false
    }
  }
  const handleLogout = async () => {
    try {
      loading.value = true
      await csrf()
      await api.post('/auth/logout')
      EchoStore.leave()
      user.value = null
      localStorage.removeItem('user')
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    errors,

    csrf,
    handleLogin,
    handleRegister,
    handleLogout
  }
})
