<script lang="ts" setup>
import TypingIndicator from '@/components/TypingIndicator.vue'
import LoadingIcon from '@/components/icons/LoadingIcon.vue'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

import { useAuthStore } from '@/stores/AuthStore'
import { useChatStore } from '@/stores/ChatStore'

const authStore = useAuthStore()
const chatStore = useChatStore()

const { user } = storeToRefs(authStore)
const { users, loading, selectedChat, onlineUsers } = storeToRefs(chatStore)

onMounted(async () => await chatStore.getUsers())
</script>

<template>
  <div
    class="w-full px-5 py-5 flex-grow overflow-auto border shadow-md rounded-lg clear-both border-gray-300"
  >
    <div class="text-center text-xl border-b-2 pb-3">{{ user?.name }}</div>

    <loading-icon v-if="loading" />
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
  </div>
</template>

<style scoped></style>
