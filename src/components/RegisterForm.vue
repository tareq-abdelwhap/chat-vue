<script lang="ts" setup>
import { ref } from 'vue'
import NameInput from '@/components/inputs/NameInput.vue'
import EmailInput from '@/components/inputs/EmailInput.vue'
import PasswordInput from '@/components/inputs/PasswordInput.vue'
import Loading from '@/components/icons/Loading.vue'
import { useAuthStore } from '@/stores/AuthStore'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const emit = defineEmits(['haveAccount'])

const authStore = useAuthStore()
const { loading, errors } = storeToRefs(authStore)

const router = useRouter()
const handleRegister = async () => {
  await authStore.handleRegister(form.value)
  await router.push({ name: 'chat' })
}
</script>

<template>
  <h2 class="text-2xl font-bold mb-4">Sign Up</h2>
  <form @submit.prevent="handleRegister">
    <name-input v-model:name="form.name" :errors="errors?.name" />
    <email-input v-model:email="form.email" :errors="errors?.email" />
    <password-input
      v-model:password="form.password"
      v-model:password-confirmation="form.password_confirmation"
      with-confirmation
      :errors="errors?.password"
    />
    <button
      type="submit"
      class="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      :disabled="loading"
      :class="{ 'opacity-50': loading }"
    >
      <loading v-if="loading" color="text-white" />
      <span v-else>SIGN UP</span>
    </button>
    <button
      type="button"
      class="mt-2 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      @click="emit('haveAccount')"
    >
      Already have an account?
    </button>
  </form>
</template>

<style scoped></style>
