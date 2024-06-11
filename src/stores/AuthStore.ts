import api from '@/utils/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useChatStore } from './ChatStore'

interface User {
  id?: number
  name?: string
  email: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user')!))
  const loading = ref(false)
  const errors = ref<{ [key: string]: string } | null>(null)

  const setUser = async () => {
    try {
      const { data } = await api.get('/auth/user')
      user.value = data.user
      localStorage.setItem('user', JSON.stringify(data.user))

      const chatStore = useChatStore()
      Echo.join('online-status')
        .here((users: Object[][]) => {
          chatStore.markUsersAsOnline(
            users.map((u) => u.id),
            true,
            true
          )
        })
        .joining((user) => {
          chatStore.markUsersAsOnline([user.id], true)
        })
        .leaving((user) => {
          chatStore.markUsersAsOnline([user.id], false)
        })
        .listen('UserOnlineStatus', (e) => {})
    } catch (e) {
      user.value = null
    }
  }

  const csrf = async () => {
    const { data } = await api.get('/auth/csrf-token')
    api.defaults.headers.common['X-CSRF-TOKEN'] = data.csrf_token
    return data.csrf_token
  }

  const handleLogin = async (payload: User) => {
    try {
      loading.value = true
      await csrf()
      errors.value = null
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
      Echo.leave(`online-status`)
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
