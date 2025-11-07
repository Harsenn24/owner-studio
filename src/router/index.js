import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/HomePage/HomePage.vue'
import LoginPage from '../components/LoginPage/LoginPage.vue'
import RegisterPage from '../components/Register/RegisterPage.vue'
import CardStudioListPage from '../components/CardStudioListPage/CardStudioListPage.vue'
import StudioNumberPage from '../components/StudioNumberPage/StudioNumberPage.vue'
import BookingPage from '../components/BookingPage/BookingPage.vue'
import ReviewOrderPage from '../components/ReviewOrderPage/ReviewOrderPage.vue'
import VerifyEmailPage from '../components/VerifyEmailPage/VerifyEmailPage.vue'
import QrCodePage from '../components/QrCodePage/QrCodePage.vue'
import TransactionDetailPage from '../components/TransactionDetailPage/TransactionDetailPage.vue'


const routes = [
  { path: '/home', component: HomePage },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/list-studio', component: CardStudioListPage },
  { path: '/booking/:booking_id', component: TransactionDetailPage },
  { path: '/list-studio/:studioId', component: StudioNumberPage },
  { path: '/list-studio/:studioId/books/:studioNumberId', component: BookingPage },
  { path: '/order', component: ReviewOrderPage },
  { path: '/order/payment', component: QrCodePage },
  { path: '/verify/owner/:uuid', component: VerifyEmailPage }


]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
