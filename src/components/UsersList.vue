<script lang="ts" setup>
import TypingIndicator from '@/components/TypingIndicator.vue'
import { useChatStore } from '@/stores/ChatStore'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const chatStore = useChatStore()
const { users, loading, selectedChat, onlineUsers } = storeToRefs(chatStore)

onMounted(async () => {
  await chatStore.getUsers()
})
</script>

<template>
  <svg
    v-if="loading"
    class="animate-spin h-5 w-5 text-blue-500 mx-auto mt-5"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      class="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      stroke-width="4"
    ></circle>
    <path
      class="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
  <ul v-else>
    <li
      v-for="user in users"
      :key="user.id"
      @click="chatStore.selectUser(user)"
      class="my-2 w-full border py-1.5 px-3 rounded-md shadow-lg cursor-pointer flex justify-between items-center"
      :class="
        selectedChat.user?.id === user.id
          ? 'bg-purple-500 text-white'
          : 'hover:bg-gray-100 hover:text-purple-500'
      "
    >
      <div class="flex items-center">
        <span
          class="w-1.5 h-1.5 rounded-full mr-2"
          :class="onlineUsers.includes(user.id) ? 'bg-green-500' : 'bg-red-500'"
        ></span>
        {{ user.name }}
      </div>
      <typing-indicator :user="user" :selected-chat="selectedChat" />
    </li>
  </ul>
</template>

<style scoped></style>
