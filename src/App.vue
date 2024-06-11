<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAuthStore } from './stores/AuthStore'
import { useChatStore } from './stores/ChatStore'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

if (user.value) {
  const chatStore = useChatStore()
  Echo.join('online-status')
    .here((users: Object[][]) => {
      chatStore.markUsersAsOnline(users.map((u) => u.id))
    })
    .joining((user) => {
      chatStore.markUsersAsOnline([user.id])
    })
    .leaving((user) => {
      chatStore.markUsersAsOnline([user.id], false)
    })
    .listen('UserOnlineStatus', (e) => {})
}
</script>

<template>
  <main
    class="min-h-screen items-center flex justify-center bg-gradient-to-t from-purple-900 via-purple-700 to-purple-900"
  >
    <RouterView />
  </main>
</template>

<style scoped></style>
