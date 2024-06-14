<script lang="ts" setup>
import SideBar from '@/components/sidebar/SideBar.vue'
import ChatBox from '@/components/chat/ChatBox.vue'
import UsersBox from '@/components/users/UsersBox.vue'
import FindUsersBox from '@/components/users/FindUsersBox.vue'
import { useSidebarStore } from '@/stores/SidebarStore'
import { storeToRefs } from 'pinia'

const sidebarStore = useSidebarStore()
const { activeTab } = storeToRefs(sidebarStore)
</script>

<template>
  <section
    class="grid grid-cols-7 mx-3 border-2 w-[90%] sm:w-[90%] md:w-[80%] lg:w-[80%] min-h-[750px] p-5 rounded-tl-[25px] rounded-br-[25px] bg-white shadow-2xl"
  >
    <side-bar span="col-span-1" />
    <users-box span="col-span-2" v-show="activeTab === 'chat'" />
    <find-users-box span="col-span-2" v-show="activeTab === 'addFriends'" />
    <chat-box span="col-span-4" />
  </section>
</template>

<style scoped></style>
