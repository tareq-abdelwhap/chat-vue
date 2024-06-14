<script lang="ts" setup>
import LoadingIcon from '@/components/icons/LoadingIcon.vue'
import SearchIcon from '@/components/icons/SearchIcon.vue'
import UsersList from '@/components/users/UsersList.vue'
import { ref } from 'vue'
import { useChatStore } from '@/stores/ChatStore'
import { storeToRefs } from 'pinia'

defineProps({
  span: {
    type: String,
    default: ''
  }
})

const chatStore = useChatStore()
const { searchResults, requestActionLoading } = storeToRefs(chatStore)

const search_input = ref()
</script>

<template>
  <div class="flex flex-col mx-1" :class="span">
    <div
      class="w-full px-5 py-5 flex-grow flex flex-col overflow-auto border shadow-md rounded-lg clear-both border-gray-300"
    >
      <div class="w-full">
        <form @submit.prevent="chatStore.searchUsers(search_input.value)">
          <div class="flex items-center border border-gray-300 p-1 rounded shadow-md bg-white">
            <input
              type="text"
              name="search"
              class="block w-full border-0 px-1 focus:outline-none focus:ring-0"
              placeholder="Name or Email"
              autocomplete="off"
              ref="search_input"
            />
            <button
              type="submit"
              class="text-blue-500 py-1 px-3 rounded-md ml-2 hover:bg-blue-100 flex items-center"
              :disabled="searchResults.loading"
              :class="{ 'opacity-50 cursor-not-allowed': searchResults.loading }"
            >
              <loading-icon v-if="searchResults.loading" center-x center-y />
              <search-icon v-else />
            </button>
          </div>
        </form>
      </div>

      <div class="mt-5 px-2 flex-grow">
        <users-list
          :computed-users="searchResults.users"
          :request-action-loading="requestActionLoading"
          type="search"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
