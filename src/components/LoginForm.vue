<script lang="ts" setup>
import { ref } from 'vue'
import EmailInput from '@/components/inputs/EmailInput.vue'
import PasswordInput from '@/components/inputs/PasswordInput.vue'
import { useAuthStore } from '@/stores/AuthStore'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const form = ref({
  email: 'test@test.com',
  password: '12345678',
  remember: false
})

const emit = defineEmits(['register'])

const authStore = useAuthStore()
const { loading, errors } = storeToRefs(authStore)

const router = useRouter()
const handleLogin = async () => {
  await authStore.handleLogin(form.value)
  await router.push({ name: 'chat' })
}
</script>

<template>
  <h2 class="text-2xl font-bold mb-4">Sign In</h2>
  <form @submit.prevent="handleLogin">
    <email-input v-model:email="form.email" :errors="errors?.email" />
    <password-input v-model:password="form.password" :errors="errors?.password" />

    <!-- Remember Me Checkbox -->
    <div class="my-4 flex items-center">
      <input
        id="remember-me"
        type="checkbox"
        v-model="form.remember"
        class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
      />
      <label for="remember-me" class="ml-2 block text-sm text-gray-900"> Remember me </label>
    </div>

    <button
      type="submit"
      class="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
      <span v-else>SIGN IN</span>
    </button>
    <button
      type="button"
      class="mt-2 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      @click="emit('register')"
    >
      Register
    </button>
  </form>
</template>

<style scoped></style>
