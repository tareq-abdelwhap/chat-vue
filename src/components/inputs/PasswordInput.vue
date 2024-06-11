<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps({
  password: {
    type: String,
    default: ''
  },
  errors: {
    types: [Array, null],
    default: null
  },
  passwordConfirmation: {
    type: String,
    default: ''
  },
  withConfirmation: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['update:password', 'update:passwordConfirmation'])

const showPassword = ref(false)
const passwordError = ref(false)
const passwordConfirmationError = ref(false)

const togglePasswordVisibility = () => (showPassword.value = !showPassword.value)
const validatePassword = (e: any) => {
  emits('update:password', e.target.value)
  passwordError.value = e.target.value.length < 8 && !!e.target.value
}

const validatepasswordConfirmationation = (e: any) => {
  emits('update:passwordConfirmation', e.target.value)
  passwordConfirmationError.value = e.target.value !== props.password
}

const errorMessage = computed(() => {
  if (props.errors) return props.errors.join(', ')
  return 'Password must be at least 8 characters long'
})
watch(props, () => (passwordError.value = !!props.errors))
</script>

<template>
  <div class="my-4">
    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
    <div class="mt-1 relative rounded-md shadow-sm">
      <input
        :type="showPassword ? 'text' : 'password'"
        class="block w-full pe-10 border p-2 rounded mt-2 focus:outline-none focus:ring focus:border-blue-500"
        :class="{ 'border-red-600': passwordError }"
        placeholder="Enter your password"
        :value="password"
        @input="validatePassword"
      />
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <button type="button" class="text-gray-500" @click="togglePasswordVisibility">
          <span v-if="showPassword">Hide</span>
          <span v-else>Show</span>
        </button>
      </div>
    </div>
    <div v-if="passwordError" class="text-red-600 sm:text-sm mt-1">
      {{ errorMessage }}
    </div>
  </div>

  <div v-if="withConfirmation" class="my-4">
    <label for="password" class="block text-sm font-medium text-gray-700"
      >Password confirmation</label
    >
    <div class="mt-1 relative rounded-md shadow-sm">
      <input
        :type="showPassword ? 'text' : 'password'"
        class="block w-full pe-10 border p-2 rounded mt-2 focus:outline-none focus:ring focus:border-blue-500"
        :class="{ 'border-red-600': passwordConfirmationError }"
        placeholder="Enter your password"
        :value="passwordConfirmation"
        @input="validatepasswordConfirmationation"
      />
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <button type="button" class="text-gray-500" @click="togglePasswordVisibility">
          <span v-if="showPassword">Hide</span>
          <span v-else>Show</span>
        </button>
      </div>
    </div>
    <div v-if="passwordConfirmationError" class="text-red-600 sm:text-sm mt-1">
      Password don't match
    </div>
  </div>
</template>

<style scoped></style>
