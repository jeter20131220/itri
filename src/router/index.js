import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import Chat from '../views/Chat.vue'
import Chat2 from '../views/Chat2.vue'
import Chat3 from '../views/Chat3.vue'
import Chat4 from '../views/Chatcopy.vue'




const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'chat',
      component: Chat,
    },
      {
      path: '/chat2',
      name: 'Chat2',
      component: Chat2,
    },
      {
      path: '/chat3',
      name: 'Chat3',
      component: Chat3,
    },
    {
      path: '/chattext',
      name: 'chattext',
      component: Chat4,
    },
  ]
})

export default router
