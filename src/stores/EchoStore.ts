import { defineStore, storeToRefs } from 'pinia'
import { useChatStore } from './ChatStore'
import { useAuthStore } from './AuthStore'
import { ref } from 'vue'

export const useEchoStore = defineStore('echo', () => {
  const authStore = useAuthStore()
  const chatStore = useChatStore()

  const timeOut = ref({})

  const onlineStatus = () => {
    const { user: authUser } = storeToRefs(authStore)
    const { users } = storeToRefs(chatStore)

    if (authUser.value) {
      Echo.join('online-status')
        .here((users: Object[][]) => {
          console.log('here', users)
          markUsersAsOnline(users)
        })
        .joining((user) => {
          console.log('joining', user)
          markUsersAsOnline(user)
        })
        .leaving((user) => {
          console.log('leaving', user)
          markUsersAsOnline(user)
        })
        .listen('OnlineStatus', ({ user }) => {
          console.log('listen', user)
          const accepted = Object.keys(user).includes('accepted') ? user.accepted : true
          if (user && authUser.value.id !== user.id) markUsersAsOnline(user, true, accepted)
        })
        .listenForWhisper('typing', (res: any) => {
          users.value.map((u) => {
            if (u.id === res.user.id) {
              authUser.value.typing = u.typing = true
              if (timeOut.value[u.id]) clearTimeout(timeOut.value[u.id])
              timeOut.value[u.id] = setTimeout(() => {
                authUser.value.typing = u.typing = false
              }, 900)
            }
          })
        })
    }
  }

  const markUsersAsOnline = (
    users: [] | Object,
    online: boolean = true,
    accepted: boolean | null = null
  ) => {
    const { onlineUsers, users: allUsers } = storeToRefs(chatStore)
    if (Array.isArray(users)) {
      onlineUsers.value = users.map((u) => u.id)
    } else {
      if (!allUsers.value.find((u) => users.id === u.id) && accepted !== null)
        allUsers.value.push({ ...users, accepted })

      if (online) onlineUsers.value = [...onlineUsers.value, users.id]
      else onlineUsers.value = onlineUsers.value.filter((u) => users.id !== u)
    }
  }

  const listenToMessages = async () => {
    const { user } = storeToRefs(authStore)
    const { selectedChat } = storeToRefs(chatStore)

    Echo.private(`chat.${user.value?.id}`).listen('ChatEvent', (res) => {
      selectedChat.value.messages?.push(res.message)
    })
  }

  const whisper = () => {
    const { user } = storeToRefs(authStore)
    setTimeout(function () {
      Echo.join('online-status').whisper('typing', {
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
