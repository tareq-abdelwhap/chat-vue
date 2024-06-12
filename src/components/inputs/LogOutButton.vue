<script lang="ts" setup>
import LoadingIcon from '@/components/icons/LoadingIcon.vue'
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
      <loading-icon v-if="loading" color="text-white" />
      <span v-else>LogOut</span>
    </button>
  </div>
</template>

<style scoped></style>
