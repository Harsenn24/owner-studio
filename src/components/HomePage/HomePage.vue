<template>
  <div class="min-h-screen bg-cover bg-center flex items-center justify-center bg-gray-700"
    style="background-image: url('/bg.jpg');">
    <div class="bg-gray-300 bg-opacity-80 p-8 rounded-2xl shadow-lg w-full max-w-md text-center m-2">
      <div class="text- font-bold mb-6 text-gray-600">
        Hallo Anak Band! Yuk Lihat Akunmu
      </div>
      <form @submit.prevent="handleSubmit">
        <input type="email" v-model="email" required placeholder="Masukkan email kamu"
          class="w-full px-4 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black mb-4 placeholder-black text-black" />
        <button type="submit"
          class="w-full bg-gray-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition">
          Lanjutkan
        </button>
      </form>
    </div>
  </div>
</template>



<script setup>
import { email, submitEmail } from './HomePage.script'
import { useRouter } from 'vue-router'
const router = useRouter()

function handleSubmit() {
  submitEmail(router)
}
</script>