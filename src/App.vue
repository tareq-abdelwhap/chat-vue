<script setup lang="ts">
import { useEchoStore } from '@/stores/EchoStore'
import { onMounted } from 'vue'

onMounted(() => useEchoStore().onlineStatus())
</script>

<template>
  <main
    class="min-h-screen items-center flex justify-center bg-gradient-to-t from-purple-900 via-purple-700 to-purple-900"
  >
    <RouterView />
  </main>
</template>

<style scoped></style>
