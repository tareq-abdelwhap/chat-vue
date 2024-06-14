<script lang="ts" setup>
import UsersList from '@/components/users/UsersList.vue'
import LoadingIcon from '@/components/icons/LoadingIcon.vue'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'

import { useChatStore } from '@/stores/ChatStore'

const chatStore = useChatStore()

const { users, loading, selectedChat, onlineUsers, requestActionLoading } = storeToRefs(chatStore)

onMounted(async () => await chatStore.getUsers())

const computedUsers = computed(() =>
  users.value.reduce(
    (acc, user) => {
      if (!user.accepted) acc.requests.push(user)
      else if (onlineUsers.value.includes(user.id)) acc.online.push(user)
      else acc.offline.push(user)
      return acc
    },
    { online: [], offline: [], requests: [] }
  )
)
const activeTab = ref<keyof typeof computedUsers.value>('online')

defineProps({
  span: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="flex flex-col mx-1" :class="span">
    <div
      class="w-full px-5 py-5 flex-grow overflow-auto border shadow-md rounded-lg clear-both border-gray-300"
    >
      <loading-icon v-if="loading" center-x center-y />
      <div v-else class="tabs">
        <div class="flex w-full text-center justify-between border-b border-gray-200">
          <div
            v-for="tab in Object.keys(computedUsers)"
            :key="tab"
            @click="activeTab = tab"
            class="border-b-2 cursor-pointer w-full py-1"
            :class="{
              'border-transparent': tab !== activeTab,
              'border-blue-300': tab === activeTab
            }"
          >
            {{ tab }} ({{ computedUsers[tab].length }})
          </div>
        </div>
        <div>
          <users-list
            :computed-users="computedUsers[activeTab]"
            :online-users="onlineUsers"
            :selected-chat="selectedChat"
            :request-action-loading="requestActionLoading"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
