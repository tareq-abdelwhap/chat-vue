<script lang="ts" setup>
defineProps({
  user: {
    type: Object,
    required: true
  },
  selectedChat: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div v-show="user.typing" class="flex space-x-1">
    <span
      class="w-0.5 h-0.5 rounded-full animate-bounce"
      :class="selectedChat.user?.id === user.id ? 'bg-white' : 'bg-gray-800'"
    ></span>
    <span
      class="w-0.5 h-0.5 rounded-full animate-bounce delay-150"
      :class="selectedChat.user?.id === user.id ? 'bg-white' : 'bg-gray-800'"
    ></span>
    <span
      class="w-0.5 h-0.5 rounded-full animate-bounce delay-300"
      :class="selectedChat.user?.id === user.id ? 'bg-white' : 'bg-gray-800'"
    ></span>
  </div>
</template>

<style scoped>
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}

.animate-bounce.delay-150 {
  animation-delay: 0.15s;
}

.animate-bounce.delay-300 {
  animation-delay: 0.3s;
}
</style>
