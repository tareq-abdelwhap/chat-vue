import { defineStore, storeToRefs } from 'pinia'
import { useChatStore } from './ChatStore'
import { useAuthStore } from './AuthStore'
import { ref } from 'vue'

export const useEchoStore = defineStore('echo', () => {
  const authStore = useAuthStore()
  const chatStore = useChatStore()

  const timeOut = ref({})

  const onlineStatus = () => {
    const { user } = storeToRefs(authStore)

    if (user.value) {
      Echo.join('online-status')
        .here((users: Object[][]) => {
          markUsersAsOnline(users.map((u) => u.id))
        })
        .joining((user) => {
          markUsersAsOnline([user.id])
        })
        .leaving((user) => {
          markUsersAsOnline([user.id], false)
        })
        .listen('UserOnlineStatus', (e) => {})
    }
  }

  const markUsersAsOnline = (users: number[], online: boolean = true, force = false) => {
    const { onlineUsers } = storeToRefs(chatStore)

    if (force) onlineUsers.value = users
    else if (online) onlineUsers.value = [...onlineUsers.value, ...users]
    else onlineUsers.value = onlineUsers.value.filter((u) => !users.includes(u))
  }

  const listenToMessages = async () => {
    const { user } = storeToRefs(authStore)
    const { users, selectedChat } = storeToRefs(chatStore)

    Echo.private(`chat.${user.value.id}`)
      .listen('ChatEvent', (res) => {
        selectedChat.value.messages?.push(res.message)
      })
      .listenForWhisper('typing', (res) => {
        users.value.map((u) => {
          if (u.id === res.user.id) {
            user.value.typing = u.typing = true
            // user.value.typing = true
            if (timeOut.value[u.id]) clearTimeout(timeOut.value[u.id])
            timeOut.value[u.id] = setTimeout(() => {
              user.value.typing = u.typing = false
              //   user.value.typing = false
            }, 1500)
          }
        })
      })
  }

  const whisper = () => {
    const { user } = storeToRefs(authStore)
    const { selectedChat } = storeToRefs(chatStore)

    const channel = Echo.private(`chat.${selectedChat.value.user?.id}`)
    setTimeout(function () {
      channel.whisper('typing', {
        user: user.value,
        typing: true
      })
    }, 300)
  }

  const leave = () => {
    const { user } = storeToRefs(authStore)
    const { selectedChat } = storeToRefs(chatStore)

    Echo.leave(`online-status`)
    Echo.leave(`chat.${user.value?.id}`)
    Echo.leave(`chat.${selectedChat.value.user?.id}`)
  }

  return {
    onlineStatus,
    listenToMessages,
    whisper,
    leave
  }
})
