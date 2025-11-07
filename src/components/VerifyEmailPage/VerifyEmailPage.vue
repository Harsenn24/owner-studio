<template>
    <div class="min-h-screen bg-cover bg-center flex items-center justify-center bg-gradient-to-br from-blue-500 via-white to-green-500 relative overflow-hidden px-6">
        <div class="bg-white bg-opacity-80 p-8 rounded-2xl shadow-lg w-full max-w-md text-center m-2">
            <div class="text-xl font-bold mb-6 text-gray-700">
                Verifikasi Email
            </div>

            <div v-if="loading" class="text-gray-600">🔄 Memverifikasi email kamu...</div>

            <div v-else-if="success" class="text-green-700 font-semibold space-y-4">
                <p>✅ Email kamu berhasil diverifikasi!</p>
                <router-link to="/login">
                    <button class="w-full bg-green-600! hover:bg-green-700 text-white py-2 rounded-lg transition">
                        Login Sekarang
                    </button>
                </router-link>
            </div>

            <div v-else class="text-red-600 font-semibold space-y-4">
                <p>❌ Link verifikasi tidak valid atau telah kedaluwarsa.</p>
                <router-link to="/login">
                    <button class="w-full bg-red-600! hover:bg-red-700 text-white py-2 rounded-lg transition">
                        Kirim Ulang Email Verifikasi
                    </button>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';
import { getIpAdresses } from '../../services/axios/ip-adress.services';


const route = useRoute()
const token = route.query.token
const loading = ref(true)
const success = ref(true)

const device_id = localStorage.getItem('device_id') || uuidv4()

onMounted(async () => {
    try {

        const headers = {
            'x-request-id': uuidv4(),
            'x-device-id': device_id,
            'x-ip-address': await getIpAdresses()
        };
        const resVerify = await axios.post(`${import.meta.env.VITE_STUDIO_BAND_BE_BASE_URL}owner/auth/verify-email`, { token_verify: token }, { headers })
        if (resVerify.data.status) {
            localStorage.setItem('token', resVerify.data.token)
        }
        success.value = resVerify.data.status

    } catch (error) {
        success.value = false
    } finally {
        loading.value = false
    }
})
</script>