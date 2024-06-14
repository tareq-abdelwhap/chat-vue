<script lang="ts" setup>
import LoadingIcon from '@/components/icons/LoadingIcon.vue'
import SendIcon from '@/components/icons/SendIcon.vue'
import { useChatStore } from '@/stores/ChatStore'
import { useEchoStore } from '@/stores/EchoStore'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'

const chatStore = useChatStore()
const EchoStore = useEchoStore()

const { selectedChat } = storeToRefs(chatStore)

const message_input = ref<HTMLElement | null>(null)
const sendMessage = async () => {
  if (selectedChat.value?.message) await chatStore.sendMessage(selectedChat.value?.message)
  selectedChat.value.message = null
  message_input.value?.focus()
}

const whisper = () => EchoStore.whisper()

watch(
  selectedChat.value,
  () =>
    !selectedChat.value.messageLoading && !!selectedChat.value.user && message_input.value?.focus()
)
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
          autocomplete="off"
          ref="message_input"
        />
        <button
          :disabled="selectedChat.messageLoading || !selectedChat.user || !selectedChat.message"
          type="submit"
          class="text-blue-500 py-2 px-3 rounded-md ml-2 hover:bg-blue-100 flex items-center"
          :class="{ 'opacity-50 cursor-not-allowed': !selectedChat.message }"
        >
          <loading-icon v-if="selectedChat.messageLoading" />
          <send-icon v-else />
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
