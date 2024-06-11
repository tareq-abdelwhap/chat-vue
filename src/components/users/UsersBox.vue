<script lang="ts" setup>
import LogOutButton from '@/components/inputs/LogOutButton.vue'
import UsersList from '@/components/users/UsersList.vue'
</script>

<template>
  <div class="col-span-1 flex flex-col mx-1">
    <users-list />
    <log-out-button />
  </div>
</template>

<style scoped></style>
