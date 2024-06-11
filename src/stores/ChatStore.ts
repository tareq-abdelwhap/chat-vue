import api from '@/utils/api'
import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './AuthStore'
import { useEchoStore } from './EchoStore'

interface User {
  id?: number
  name?: string
  email: string
  selected?: boolean
  typing?: boolean
  online?: boolean
}

export const useChatStore = defineStore('chat', () => {
  const authStore = useAuthStore()

  const users = ref<User[]>([])
  const loading = ref(false)
  const selectedChat = ref<{
    loading?: boolean
    messageLoading?: boolean
    user: User | null
    messages?: string[]
    message?: string | null
  }>({ loading: false, user: null })
  const onlineUsers = ref<number[]>([])

  const getUsers = async () => {
    try {
      loading.value = true
      const { data } = await api.get('/users')
      users.value = data.users
    } catch (e) {
      users.value = []
    } finally {
      loading.value = false
    }
  }

  const selectUser = async (user: User) => {
    try {
      selectedChat.value.message = null
      selectedChat.value.user = user
      selectedChat.value.loading = true
      const { data } = await api.get(`/messages/${user.id}`)
      selectedChat.value.messages = data.messages
    } catch (e) {
      console.error(e)
    } finally {
      selectedChat.value.loading = false
    }
  }

  const sendMessage = async (message: string) => {
    try {
      selectedChat.value.messageLoading = true
      await authStore.csrf()
      const { data } = await api.post('/messages', {
        message,
        receiver_id: selectedChat.value.user?.id
      })
      selectedChat.value.messages?.push(data.message)
    } catch (e) {
      console.error(e)
    } finally {
      selectedChat.value.messageLoading = false
    }
  }

  return {
    users,
    loading,
    selectedChat,
    onlineUsers,

    getUsers,
    selectUser,
    sendMessage
  }
})
