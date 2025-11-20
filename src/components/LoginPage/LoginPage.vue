<template>
  <div
    class="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-white to-green-500 relative overflow-hidden px-6">

    <!-- background soft gradient shapes -->
    <div class="absolute top-0 left-0 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl"></div>

    <!-- Title -->
    <div class="text-center mb-8 z-10">
      <h1 class="text-4xl font-extrabold text-slate-800">
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">
          StudioSpace
        </span>
      </h1>
      <p class="text-slate-500 text-sm mt-2">
        Kelola dan promosikan studiomu dengan mudah.
      </p>
    </div>

    <!-- Form Card -->
    <div class="w-full max-w-md bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 p-8 z-10">

      <h2 class="text-2xl font-bold text-slate-800 mb-2">
        {{ isLogin ? 'Masuk ke akunmu' : 'Buat akun baru' }}
      </h2>
      <p class="text-slate-500 text-sm mb-6">
        {{ isLogin ? 'Masukkan email dan password untuk melanjutkan.' : 'Isi data berikut untuk membuat akun baru.' }}
      </p>

      <form @submit.prevent="submitForm" class="flex flex-col gap-4">
        <div v-if="!isLogin">
          <label class="text-xs font-medium text-slate-600">Nama Lengkap</label>
          <input v-model="form.name" required
            class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
            placeholder="Contoh: Ahmad Nidjam" :disabled="isLoading" />
        </div>

        <div>
          <label class="text-xs font-medium text-slate-600">Email</label>
          <input v-model="form.email" type="email" required
            class="mt-1 w-full rounded-lg border text-black border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="ahmadnidjam@example.com" :disabled="isLoading" />
        </div>

        <!-- Password with reveal -->
        <div class="relative">
          <label class="text-xs font-medium text-slate-600">Password</label>
          <input v-model="form.password" :type="showPassword ? 'text' : 'password'" required
            class="mt-1 w-full text-black rounded-lg border border-slate-200 px-3 py-2 pr-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="••••••••" :disabled="isLoading" />
          <button type="button" @click="toggleShowPassword" :disabled="isLoading"
            class="absolute right-0 top-[55%] -translate-y-1/4 text-slate-500 hover:text-slate-800 focus:outline-none bg-white! ">
            <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="1.6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>

            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="1.6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 3l18 18" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.88 9.88A3 3 0 0114.12 14.12" />
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c1.1 0 2.156.18 3.123.52M20.542 12c-1.274 4.057-5.064 7-9.542 7-1.057 0-2.084-.16-3.03-.46" />
            </svg>
          </button>
        </div>

        <button type="submit" :disabled="isLoading"
          class="mt-2 inline-flex justify-center items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold shadow-md hover:scale-[1.02] transition-transform disabled:opacity-70 disabled:cursor-not-allowed">
          <template v-if="!isLoading">
            <svg v-if="isLogin" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            {{ isLogin ? 'Masuk Sekarang' : 'Daftar Sekarang' }}
          </template>

          <!-- Spinner -->
          <template v-else>
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"></path>
            </svg>
            <span>Memproses...</span>
          </template>
        </button>
      </form>

      <p class="mt-6 text-sm text-slate-500 text-center">
        {{ isLogin ? 'Belum punya akun?' : 'Sudah punya akun?' }}
        <button @click="toggleForm" :disabled="isLoading"
          class="text-white font-medium bg-gradient-to-r from-blue-500 to-green-500 px-2 py-1 rounded-md hover:opacity-90 transition disabled:opacity-70 disabled:cursor-not-allowed">
          {{ isLogin ? 'Daftar disini' : 'Masuk disini' }}
        </button>
      </p>
    </div>

    <p class="mt-10 text-xs text-slate-400 text-center z-10">
      © 2025 StudioSpace. All rights reserved.
    </p>

    <!-- Global overlay saat loading -->
    <div v-if="isLoading"
      class="absolute inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm transition">
      <svg class="animate-spin h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"></path>
      </svg>
    </div>

    <ModalEmailSentPage v-if="showModal" :handleClose="handleClose" />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { getIpAdresses } from '../../services/axios/ip-adress.services.js'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import { useRouter } from 'vue-router'
import ModalEmailSentPage from '../ModalEmailSentPage/ModalEmailSentPage.vue'

const router = useRouter()
const showPassword = ref(false)
const isLogin = ref(true)
const showModal = ref(false)
const isLoading = ref(false) // ✅ state loading baru

const form = reactive({
  name: '',
  email: '',
  password: ''
})

function handleClose() {
  showModal.value = false
  isLogin.value = true
  router.push('/login')
}

function toggleForm() {
  if (isLoading.value) return // biar ga bisa toggle saat loading
  isLogin.value = !isLogin.value
}

function toggleShowPassword() {
  showPassword.value = !showPassword.value
}

async function register(name, email, password) {
  try {
    const BE_BASE_URL = import.meta.env.VITE_STUDIO_BAND_BE_BASE_URL
    const ipAddress = await getIpAdresses()

    const response = await axios.post(
      `${BE_BASE_URL}owner/auth/register`,
      { email, password, name },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-ip-address': ipAddress,
          'x-device-id': uuidv4(),
          'x-request-id': uuidv4()
        },
      }
    )

    if (!response.data.status) throw new Error('Gagal register')
    return true
  } catch (error) {
    console.error(error)
    alert('Terjadi kesalahan saat register')
    return false
  }
}

async function handleRegister(name, email, password) {
  isLoading.value = true // ✅ mulai loading
  try {
    const result = await register(name, email, password)
    if (result) {
      showModal.value = true
    }
  } finally {
    isLoading.value = false // ✅ matikan loading
  }
}

async function login(email, password) {
  isLoading.value = true // ✅ mulai loading
  try {
    const BE_BASE_URL = import.meta.env.VITE_STUDIO_BAND_BE_BASE_URL
    const ipAddress = await getIpAdresses()

    const response = await axios.post(
      `${BE_BASE_URL}owner/auth/login`,
      { email, password },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-ip-address': ipAddress,
          'x-device-id': uuidv4(),
          'x-request-id': uuidv4()
        }
      }
    )

    const result = response.data
    if (!result.status) {
      throw new Error(result.message || 'Terjadi kesalahan saat login')
    }

    if (result.data.token) {
      localStorage.setItem('token', result.data.token)
      localStorage.setItem('device_id', uuidv4())
      window.location.href = '/home'
    }

    if (result.message === "Verification email re-sent") {
      showModal.value = true
    }

  } catch (err) {
    alert(err.message)
  } finally {
    isLoading.value = false // ✅ pastikan loading mati
  }
}

async function submitForm() {
  if (isLoading.value) return // biar gak double klik
  if (isLogin.value) {
    await login(form.email, form.password)
  } else {
    await handleRegister(form.name, form.email, form.password)
  }
}
</script>
