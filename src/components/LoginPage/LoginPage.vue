<template>
  <div class="min-h-screen bg-cover bg-center flex items-center justify-center bg-gray-700"
    style="background-image: url('/bg.jpg');">
    <div class="bg-gray-300 bg-opacity-80 p-8 rounded-2xl shadow-lg w-full max-w-md text-center m-2">
      <div class="text-lg font-bold mb-6 text-gray-600 w-80">
        Hallo Anak Band! Silakan Login
      </div>

      <form @submit.prevent="handleLogin">
        <!-- EMAIL INPUT -->
        <div class="mb-4">
          <input type="email" v-model="email" required placeholder="Masukkan email kamu"
            class="w-full px-4 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black placeholder-black text-black" />
        </div>

        <!-- PASSWORD INPUT -->
        <div class="relative mb-4">
          <input :type="showPassword ? 'text' : 'password'" v-model="password" required
            placeholder="Masukkan password kamu"
            class="w-full px-4 py-2 pr-10 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black placeholder-black text-black" />
          <span class="absolute right-3 top-2.5 cursor-pointer text-gray-700" @click="handleTogglePassword">
            {{ showPassword ? '🙈' : '👁️' }}
          </span>
        </div>

        <button type="submit"
          class="w-full bg-gray-700! text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
          :disabled="isLoading">
          <span v-if="!isLoading">LOGIN</span>
          <span v-else class="flex items-center">
            <svg class="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading...
          </span>
        </button>

        <div class="text-lg font-bold mb-2 text-gray-600 w-80 mt-2">
          or
        </div>

      </form>
      <button type="button"
        class="w-full bg-white! text-black font-semibold py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
        @click="router.push('/register')">
        REGISTER
      </button>

      <ModalEmailSentPage v-if="showModal" :handleClose="handleCloseModalEmailVerify" />
      <ModalEmailLimitPage v-if="showModalEmailLimit" :handleClose="handleCloseModalEmailLimit" />


    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import ModalEmailSentPage from '../ModalEmailSentPage/ModalEmailSentPage.vue'
import { email, password, submitLogin, togglePassword, showPassword } from './LoginPage.script'
import { useRouter } from 'vue-router'
import ModalEmailLimitPage from '../ModalEmailLimitPage/ModalEmailLimitPage.vue'
const router = useRouter()
const showModal = ref(false)
const showModalEmailLimit = ref(false)
const isLoading = ref(false)



async function handleLogin() {
  isLoading.value = true
  try {
    const result = await submitLogin(router)

    if (result && result.message === "Verification email re-sent") {
      showModal.value = true
    }

    if (result && result.message === "Email has been limited") {
      showModalEmailLimit.value = true
      return
    }
  } catch (error) {
    console.error("Login error", error)
  } finally {
    isLoading.value = false
  }
}

function handleTogglePassword() {
  togglePassword()
}

function handleCloseModalEmailVerify() {
  showModal.value = false
  window.location.href = '/login'
}

function handleCloseModalEmailLimit() {
  showModal.value = false
  window.location.href = '/login'
}


</script>