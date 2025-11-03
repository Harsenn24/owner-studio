<template>
    <div class="min-h-screen bg-cover bg-center flex items-center justify-center bg-gray-700"
        style="background-image: url('/bg.jpg');">
        <div class="bg-gray-300 bg-opacity-80 p-8 rounded-2xl shadow-lg w-full max-w-md text-center m-2">
            <div class="text- font-bold mb-6 text-gray-600 w-80">
                Hallo Anak Band! Daftar Dulu ya
            </div>
            <form @submit.prevent="handleRegister">
                <!-- NAME INPUT -->
                <div class="mb-4">
                    <input type="text" v-model="name" required placeholder="Masukkan nama kamu"
                        class="w-full px-4 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black placeholder-black text-black" />
                </div>

                <!-- EMAIL INPUT -->
                <div class="mb-4">
                    <input type="email" v-model="email" required placeholder="Masukkan email kamu"
                        class="w-full px-4 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black placeholder-black text-black" />
                </div>

                <!-- PASSWORD INPUT DENGAN ICON SHOW/HIDE -->
                <div class="relative mb-4">
                    <input :type="showPassword ? 'text' : 'password'" v-model="password" required
                        placeholder="Masukkan password kamu"
                        class="w-full px-4 py-2 pr-10 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black placeholder-black text-black" />
                    <span class="absolute right-3 top-2.5 cursor-pointer text-gray-700" @click="handleTogglePassword">
                        {{ showPassword ? '🙈' : '👁️' }}
                    </span>
                </div>

                <button type="submit"
                    class="w-full bg-gray-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition">
                    Register
                </button>
            </form>


            <ModalEmailSentPage v-if="showModal" :handleClose="handleClose" />

        </div>
    </div>
</template>

<script setup>
import ModalEmailSentPage from '../ModalEmailSentPage/ModalEmailSentPage.vue'
import { name, email, password, submitRegister, togglePassword, showPassword } from './RegisterPage.script'
import { ref } from 'vue'

import { useRouter } from 'vue-router'
const router = useRouter()
const showModal = ref(false)

function handleRegister() {
    const result = submitRegister(router)
    if (result) {
        showModal.value = true
    }
}

function handleClose() {
    showModal.value = false
    router.push('/login')
}

function handleTogglePassword() {
    togglePassword()
}

</script>