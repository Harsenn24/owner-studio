import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/HomePage/HomePage.vue'
import LoginPage from '../components/LoginPage/LoginPage.vue'
import VerifyEmailPage from '../components/VerifyEmailPage/VerifyEmailPage.vue'
import CreateStudioDetailPage from '../components/CreateStudioDetailPage/CreateStudioDetailPage.vue'



const routes = [
  { path: '/home', component: HomePage },
  { path: '/login', component: LoginPage },
  { path: '/verify/owner/:uuid', component: VerifyEmailPage },
  { path: '/home/create-studio-detail/:studio_submission_id', component: CreateStudioDetailPage },

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
