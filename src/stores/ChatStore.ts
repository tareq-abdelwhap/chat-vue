import api from '@/utils/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './AuthStore'

interface User {
  id?: number
  name?: string
  email: string
  selected?: boolean
  typing?: boolean
  online?: boolean
  accepted?: boolean
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
  const requestActionLoading = ref<{ [key: string | number]: boolean }>({})
  const searchResults = ref({
    users: [] as User[],
    loading: false
  })

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

  const requestAction = async (user: User, accepted: boolean | null) => {
    try {
      requestActionLoading.value[user.id as number] = true
      await authStore.csrf()
      await api.put(`/users/${user.id}`, { accepted })
      if (accepted !== null) {
        users.value = users.value.map((u: User) => {
          if (u.id === user.id) u.accepted = accepted
          return u
        })
      }
    } catch (e) {
      console.error(e)
    } finally {
      requestActionLoading.value[user.id as number] = false
    }
  }

  const searchUsers = async (q) => {
    try {
      searchResults.value.loading = true
      await authStore.csrf()
      const { data } = await api.post('/users/search', {
        searchQuery: q
      })
      searchResults.value.users = data.users
    } catch (e) {
      console.error(e)
    } finally {
      searchResults.value.loading = false
    }
  }

  const addFriend = async (user: User) => {
    try {
      requestActionLoading.value[user.id as number] = true
      await authStore.csrf()
      await api.post(`/users/add`, { friend_id: user.id })
      user.sent = true
    } catch (e) {
      console.error(e)
    } finally {
      requestActionLoading.value[user.id as number] = false
    }
  }

  return {
    users,
    loading,
    selectedChat,
    onlineUsers,
    requestActionLoading,
    searchResults,

    getUsers,
    selectUser,
    sendMessage,
    requestAction,
    searchUsers,
    addFriend
  }
})
