<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import TypingIndicator from '@/components/TypingIndicator.vue'
import { useAuthStore } from '@/stores/AuthStore'
import { useChatStore } from '@/stores/ChatStore'
import { nextTick, ref, watch } from 'vue'

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
</script>

<template>
  <ul
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
</template>

<style scoped></style>
