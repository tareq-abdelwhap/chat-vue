import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useChatStore } from '@/stores/ChatStore'

export const useSidebarStore = defineStore('sidebar', () => {
  const chatStore = useChatStore()

  const tabs = ref({
    chat: {
      title: 'Chat',
      action: async () => {}
    },
    addFriends: {
      title: 'Add friends',
      action: () => {}
    }
  })
  type Tab = keyof typeof tabs.value
  const activeTab = ref<Tab>('chat')

  const changeActiveTab = async (tab: Tab) => {
    const { selectedChat } = storeToRefs(chatStore)

    activeTab.value = tab
    selectedChat.value = { loading: false, user: null }
    await tabs.value[tab].action()
  }

  return {
    tabs,
    activeTab,

    changeActiveTab
  }
})
