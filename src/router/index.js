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
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/create-form',
      name: 'create-form',
      component: () => import('../views/CreateFormView.vue')
    },
    {
      path: '/forms/:slug',
      name: 'form',
      component: () => import('../views/DetailFormView.vue')
    },
    {
      path: '/forms/:slug/responses',
      name: 'responses',
      component: () => import('../views/ResponseView.vue')
    },
    {
      path: '/forms/:slug/response',
      name: 'submit-response',
      component: () => import('../views/SubmitResponseView.vue')
    },
    {
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: () => import('../views/404NotFound.vue')
    }
  ]
})

// router.beforeEach((to, from, next) => {
  
// })

export default router
