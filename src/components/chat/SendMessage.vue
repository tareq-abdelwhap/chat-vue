<script lang="ts" setup>
import { useChatStore } from '@/stores/ChatStore'
import { useEchoStore } from '@/stores/EchoStore'
import { storeToRefs } from 'pinia'

const chatStore = useChatStore()
const EchoStore = useEchoStore()

const { selectedChat } = storeToRefs(chatStore)

const sendMessage = () => {
  if (selectedChat.value?.message) chatStore.sendMessage(selectedChat.value?.message)
  selectedChat.value.message = null
}

const whisper = () => EchoStore.whisper()
</script>

<template>
  <div class="w-full mt-2">
    <form @submit.prevent="sendMessage">
      <div class="flex items-center border border-gray-300 p-1 rounded shadow-md bg-white">
        <input
          :disabled="selectedChat.messageLoading || !selectedChat.user"
          v-model="selectedChat.message"
          @keydown="whisper"
          type="text"
          name="message"
          class="block w-full border-0 p-1 focus:outline-none focus:ring-0"
          :class="{
            'opacity-50 cursor-not-allowed': selectedChat.messageLoading || !selectedChat.user
          }"
          placeholder="Enter your message"
        />
        <button
          :disabled="selectedChat.messageLoading || !selectedChat.user || !selectedChat.message"
          type="submit"
          class="text-blue-500 py-2 px-3 rounded-md ml-2 hover:bg-blue-100 flex items-center"
          :class="{ 'opacity-50 cursor-not-allowed': !selectedChat.message }"
        >
          <loading v-if="selectedChat.messageLoading" />
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              d="M15.854.146a.5.5 0 0 0-.76.057L1.33 8.14a.5.5 0 0 0 .163.808l4.01 1.604 1.604 4.01a.5.5 0 0 0 .808.163l7.937-13.764a.5.5 0 0 0-.057-.76l-.001-.001zM6.84 9.267l2.523-2.523-5.982 2.394 1.346 1.346 2.523-2.523z"
            />
          </svg>
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
