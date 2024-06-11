<script lang="ts" setup>
import { useAuthStore } from '@/stores/AuthStore'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const { loading } = storeToRefs(authStore)

const router = useRouter()

const handleLogout = async () => {
  await authStore.handleLogout()
  await router.push({ name: 'home' })
}
</script>

<template>
  <div class="mt-2">
    <button
      @click="handleLogout"
      class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full flex justify-center"
      :disabled="loading"
      :class="{ 'opacity-50': loading }"
    >
      <svg
        v-if="loading"
        class="animate-spin h-5 w-5 text-white"
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
      <span v-else>LogOut</span>
    </button>
  </div>
</template>

<style scoped></style>
