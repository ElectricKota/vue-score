import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: "/404",
      name: "404",
      component: () => import("../views/NotFoundView.vue"),
    },
    {
      path: "/:catchAll(.*)",
      redirect: "/404",
    },
  ]
})

export default router
