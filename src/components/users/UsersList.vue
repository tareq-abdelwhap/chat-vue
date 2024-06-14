<script lang="ts" setup>
import TypingIndicator from '@/components/TypingIndicator.vue'
import LoadingIcon from '@/components/icons/LoadingIcon.vue'
import { useChatStore } from '@/stores/ChatStore'

defineProps({
  computedUsers: {
    type: Object
  },
  onlineUsers: {
    type: Array,
    default: () => [],
    required: false
  },
  selectedChat: {
    type: Object,
    default: () => {},
    required: false
  },
  requestActionLoading: {
    type: { keys: String, values: Boolean }
  },
  type: {
    type: String,
    default: 'chat',
    required: false
  }
})

const chatStore = useChatStore()
</script>

<template>
  <ul :class="`relative h-[600px] overflow-auto`">
    <li
      v-for="user in computedUsers"
      :key="user.id"
      @click="user.accepted && chatStore.selectUser(user)"
      class="my-2 w-full border py-1.5 px-3 rounded-md shadow-lg cursor-pointer flex justify-between items-center"
    >
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center">
          <span
            v-if="user.accepted"
            class="w-1.5 h-1.5 rounded-full mr-2"
            :class="onlineUsers.includes(user.id) ? 'bg-green-500' : 'bg-red-500'"
          ></span>
          {{ user.name }}
        </div>

        <template v-if="!user.accepted && type === 'chat'">
          <loading-icon v-if="requestActionLoading[user.id]" />
          <div v-else class="flex items-center space-x-5">
            <button
              @click.stop.prevent="chatStore.requestAction(user, true)"
              class="text-xs text-blue-500 hover:underline underline-offset-2"
            >
              Accept
            </button>
            <button
              @click.stop.prevent="chatStore.requestAction(user, false)"
              class="text-xs text-red-500 hover:underline underline-offset-2"
            >
              Reject
            </button>
          </div>
        </template>
        <template v-if="type === 'search'">
          <loading-icon v-if="requestActionLoading[user.id]" />
          <template v-else>
            <div v-if="user.sent" class="flex items-center space-x-5 text-xs">Sent</div>
            <div v-else class="flex items-center space-x-5">
              <button
                @click.stop.prevent="chatStore.addFriend(user)"
                class="text-xs text-blue-500 hover:underline underline-offset-2"
              >
                Send Request
              </button>
            </div>
          </template>
        </template>
      </div>
      <typing-indicator v-if="user.accepted" :user="user" :selected-chat="selectedChat" />
    </li>
  </ul>
</template>

<style scoped></style>
