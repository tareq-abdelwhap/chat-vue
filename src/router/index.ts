import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '@/views/AuthView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: AuthView
    },
    {
      path: '/chat',
      name: 'chat',
      // route level code-splitting
      // this generates a separate chunk (chat.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/ChatView.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.name === 'home' && localStorage.getItem('user')) {
    next({ name: 'chat' })
  } else if (to.name === 'chat' && !localStorage.getItem('user')) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
