import api from '@/utils/api'
import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './AuthStore'

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
      return data
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

  const timeOut: {} = {}
  const listenToMessages = async (user) => {
    const { user: authUser } = storeToRefs(authStore)
    Echo.join(`chat.${user.id}`)
      .listen('MessageSent', (res) => {
        selectedChat.value.messages?.push(res.message)
      })
      .listenForWhisper('typing', (res) => {
        users.value.map((u) => {
          if (u.id === res.user.id) {
            u.typing = true
            authUser.value.typing = true
            if (timeOut[u.id]) clearTimeout(timeOut[u.id])
            timeOut[u.id] = setTimeout(() => {
              u.typing = false
              authUser.value.typing = false
            }, 1500)
          }
        })
      })
  }

  const markUsersAsOnline = (users: number[], online: boolean = true, force = false) => {
    if (force) onlineUsers.value = users
    else if (online) onlineUsers.value = [...onlineUsers.value, ...users]
    else onlineUsers.value = onlineUsers.value.filter((u) => !users.includes(u))
  }

  return {
    users,
    loading,
    selectedChat,
    onlineUsers,

    getUsers,
    selectUser,
    sendMessage,
    listenToMessages,
    markUsersAsOnline
  }
})
