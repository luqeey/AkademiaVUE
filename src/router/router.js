import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/components/ShoppingList.vue')
    },
    {
      path: '/shopping-list/:id',
      name: 'Detail',
      component: () => import('@/components/ShoppingDetail.vue')
    }
  ];

  const router = createRouter({
    history: createWebHistory(),
    routes,
  });


export default router;