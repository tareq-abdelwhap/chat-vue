<script lang="ts" setup>
import TypingIndicator from './TypingIndicator.vue'
import { useAuthStore } from '@/stores/AuthStore'
import { useChatStore } from '@/stores/ChatStore'
import { storeToRefs } from 'pinia'
import { nextTick, onMounted, ref, watch } from 'vue'

const authStore = useAuthStore()
const chatStore = useChatStore()

const { user } = storeToRefs(authStore)
const { selectedChat } = storeToRefs(chatStore)

const sendMessage = () => {
  if (selectedChat.value?.message) chatStore.sendMessage(selectedChat.value?.message)
  selectedChat.value.message = null
}

const chatContainer = ref<HTMLElement | null>(null)
const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}
// Watch for changes in selectedChat.messages
watch(selectedChat.value, () => nextTick(() => scrollToBottom()), { deep: true })

onMounted(() => {
  chatStore.listenToMessages(user.value)
})

const whisper = () => {
  setTimeout(function () {
    Echo.join(`chat.${selectedChat.value.user?.id}`).whisper('typing', {
      user: user.value,
      typing: true
    })
  }, 300)
}
</script>

<template>
  <div class="col-span-2 flex flex-col mx-1">
    <div
      v-if="!selectedChat.user || selectedChat.loading"
      class="w-full px-5 py-5 flex justify-center items-center flex-grow overflow-auto border shadow-md rounded-lg clear-both border-gray-300"
    >
      <svg
        v-if="selectedChat.loading"
        class="animate-spin h-5 w-5 text-blue-500"
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

      <span v-else>Select user to start chat</span>
    </div>

    <ul
      v-else
      class="w-full px-5 max-h-[656px] pb-5 flex-grow overflow-auto border shadow-md rounded-lg clear-both border-gray-300"
      ref="chatContainer"
    >
      <li class="text-center text-xl border-b-2 py-3 sticky top-0 mb-5 bg-white">
        Chat with: {{ selectedChat.user?.name }}
        <div class="flex justify-center mt-2">
          <typing-indicator :user="user" :selected-chat="selectedChat" />
        </div>
      </li>
      <li
        v-for="message in selectedChat.messages"
        :key="message.id"
        class="block my-2 mx-2 w-fit border py-1.5 px-5 clear-both shadow-lg"
        :class="[
          message.sender_id === user?.id
            ? 'rounded-l-[15px] rounded-tr-[25px] float-right'
            : 'rounded-tl-[25px] rounded-r-[15px] float-left'
        ]"
      >
        {{ message.message }}
      </li>
    </ul>

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
            <svg
              v-if="selectedChat.messageLoading"
              class="animate-spin h-5 w-5 text-blue-500"
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
  </div>
</template>

<style scoped></style>
