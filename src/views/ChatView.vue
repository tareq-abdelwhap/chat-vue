<script lang="ts" setup>
import ChatBox from '@/components/chat/ChatBox.vue'
import UsersBox from '@/components/users/UsersBox.vue'
</script>

<template>
  <section
    class="grid grid-cols-3 mx-3 border-2 w-[80%] sm:w-[70%] md:w-[60%] lg:w-[60%] min-h-[750px] p-5 rounded-tl-[25px] rounded-br-[25px] bg-white shadow-2xl"
  >
    <users-box />
    <chat-box />
  </section>
</template>

<style scoped></style>
