<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps({
  name: {
    type: String,
    default: ''
  },
  errors: {
    types: [Array, null, undefined],
    default: null
  }
})
const emits = defineEmits(['update:name'])

const nameError = ref<boolean>(false)

const validateName = (e: any) => {
  emits('update:name', e.target.value)
  nameError.value = !e.target.value.length
}

const errorMessage = computed(() => {
  if (props.errors) return props.errors.join(', ')
  return 'Invalid name'
})
watch(props, () => (nameError.value = !!props.errors))
</script>

<template>
  <div class="my-4">
    <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
    <div class="mt-1 relative rounded-md shadow-sm">
      <input
        type="text"
        class="block w-full pe-10 border p-2 rounded mt-2 focus:outline-none focus:ring focus:border-blue-500"
        :class="{ 'border-red-600': nameError }"
        placeholder="Full name"
        :value="name"
        @input="validateName"
      />
    </div>
    <div v-if="nameError" class="text-red-600 sm:text-sm mt-1">
      {{ errorMessage }}
    </div>
  </div>
</template>

<style scoped></style>
