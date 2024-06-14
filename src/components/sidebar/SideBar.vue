<script lang="ts" setup>
import LogOutButton from '@/components/inputs/LogOutButton.vue'
import { useAuthStore } from '@/stores/AuthStore'
import { useSidebarStore } from '@/stores/SidebarStore'
import { storeToRefs } from 'pinia'

defineProps({
  span: {
    type: String,
    default: ''
  }
})

const authStore = useAuthStore()
const sidebarStore = useSidebarStore()

const { user } = storeToRefs(authStore)
const { tabs, activeTab } = storeToRefs(sidebarStore)
</script>

<template>
  <div class="flex flex-col mx-1" :class="span">
    <div
      class="w-full px-5 py-5 flex-grow flex flex-col overflow-auto border shadow-md rounded-lg clear-both border-gray-300"
    >
      <div class="flex-grow border-b-2">
        <div class="text-center text-xl border-b-2 pb-3">{{ user?.name }}</div>
        <div class="flex flex-col gap-2 mt-2 w-full justify-between">
          <div
            v-for="(tab, key) in tabs"
            :key="key"
            @click="sidebarStore.changeActiveTab(key)"
            class="cursor-pointer w-full py-1 rounded px-5"
            :class="{
              'bg-white hover:bg-gray-100': key !== activeTab,
              'bg-blue-300': key === activeTab
            }"
          >
            {{ tab.title }}
          </div>
        </div>
      </div>
      <log-out-button />
    </div>
  </div>
</template>

<style scoped></style>
