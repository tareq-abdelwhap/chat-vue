<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps({
  email: {
    type: String,
    default: ''
  },
  errors: {
    types: [Array, null],
    default: null
  }
})
const emits = defineEmits(['update:email'])

const emailError = ref<boolean>(false)

const validateEmail = (e: any) => {
  emits('update:email', e.target.value)
  emailError.value = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value) && !!e.target.value.length
}

const errorMessage = computed(() => {
  if (props.errors) return props.errors.join(', ')
  return 'Invalid email'
})
watch(props, () => {
  emailError.value = !!props.errors
})
</script>

<template>
  <div class="my-4">
    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
    <div class="mt-1 relative rounded-md shadow-sm">
      <input
        type="email"
        class="block w-full pe-10 border p-2 rounded mt-2 focus:outline-none focus:ring focus:border-blue-500"
        :class="{ 'border-red-600': emailError }"
        placeholder="you@example.com"
        :value="email"
        @input="validateEmail"
      />
    </div>
    <div v-if="emailError" class="text-red-600 sm:text-sm mt-1">
      {{ errorMessage }}
    </div>
  </div>
</template>

<style scoped></style>
