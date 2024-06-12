<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import TypingIndicator from '@/components/TypingIndicator.vue'
import { useAuthStore } from '@/stores/AuthStore'
import { useChatStore } from '@/stores/ChatStore'
import { nextTick, onMounted, ref, watch } from 'vue'

const authStore = useAuthStore()
const chatStore = useChatStore()

const { user } = storeToRefs(authStore)
const { selectedChat } = storeToRefs(chatStore)

const chatContainer = ref<HTMLElement | null>(null)
const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

watch(selectedChat.value, () => nextTick(() => scrollToBottom()), { deep: true })

onMounted(() => nextTick(() => scrollToBottom()))
</script>

<template>
  <div class="text-center text-xl py-3 sticky top-0 bg-white">
    Chat with: {{ selectedChat.user?.name }}
  </div>
  <ul
    class="w-full px-5 h-[604px] pb-5 overflow-auto border shadow-md rounded-lg border-gray-300 flex flex-col"
    ref="chatContainer"
  >
    <div class="flex-grow"></div>
    <li
      v-for="message in selectedChat.messages"
      :key="message.id"
      class="block my-2 mx-2 w-fit border py-1.5 px-5 shadow-lg"
      :class="[
        message.sender_id === user?.id
          ? 'rounded-l-[15px] rounded-tr-[25px] self-end bg-blue-100'
          : 'rounded-tl-[25px] rounded-r-[15px] bg-gray-100'
      ]"
    >
      {{ message.message }}
    </li>

    <li class="block mt-3 mx-2 w-fit px-5">
      <typing-indicator :user="user" :selected-chat="selectedChat" />
    </li>
  </ul>
</template>

<style scoped></style>
