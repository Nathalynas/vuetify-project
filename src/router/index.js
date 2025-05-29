import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/produtos',
    name: 'Produtos',
    component: () => import('../views/ProductListView.vue'),
  },
  {
    path: '/perfil',
    name: 'Perfil',
    component: () => import('../views/ProfileView.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
