<script lang="ts" setup>
import LogOutButton from '@/components/inputs/LogOutButton.vue'
import UsersList from '@/components/UsersList.vue'
import ChatBox from '@/components/ChatBox.vue'
import { useAuthStore } from '@/stores/AuthStore'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()

const { user } = storeToRefs(authStore)
</script>

<template>
  <section
    class="grid grid-cols-3 mx-3 border-2 w-[80%] sm:w-[70%] md:w-[60%] lg:w-[60%] min-h-[750px] p-5 rounded-tl-[25px] rounded-br-[25px] bg-white shadow-2xl"
  >
    <div class="col-span-1 flex flex-col mx-1">
      <div
        class="w-full px-5 py-5 flex-grow overflow-auto border shadow-md rounded-lg clear-both border-gray-300"
      >
        <div class="text-center text-xl border-b-2 pb-3">{{ user?.name }}</div>
        <users-list />
      </div>
      <div class="mt-2">
        <log-out-button />
      </div>
    </div>

    <!-- Chat -->
    <chat-box />
  </section>
</template>

<style scoped></style>
