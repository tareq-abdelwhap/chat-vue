<script lang="ts" setup>
import LoadingIcon from '@/components/icons/LoadingIcon.vue'
import Messages from '@/components/chat/Messages.vue'
import SendMessage from '@/components/chat/SendMessage.vue'
import { useChatStore } from '@/stores/ChatStore'
import { useEchoStore } from '@/stores/EchoStore'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const chatStore = useChatStore()
const EchoStore = useEchoStore()

const { selectedChat } = storeToRefs(chatStore)

onMounted(() => EchoStore.listenToMessages())
</script>

<template>
  <div class="col-span-2 flex flex-col mx-1">
    <div
      v-if="!selectedChat.user || selectedChat.loading"
      class="w-full px-5 py-5 flex justify-center items-center flex-grow overflow-auto border shadow-md rounded-lg clear-both border-gray-300"
    >
      <loading-icon v-if="selectedChat.loading" />
      <span v-else>Select user to start chat</span>
    </div>
    <messages v-else />
    <send-message />
  </div>
</template>

<style scoped></style>
