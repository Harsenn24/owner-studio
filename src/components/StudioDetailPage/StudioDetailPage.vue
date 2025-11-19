<template>
    <div class="min-h-screen flex flex-col bg-gradient-to-b from-white via-gray-50 to-gray-100 p-6">

        <!-- TITLE -->
        <div v-if="isInitialLoading" class="flex-1 flex flex-col items-center justify-center">
            <div class="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p class="text-slate-500">Loading studios...</p>
        </div>

        <template v-else>
            <header class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-bold text-slate-800">StudioSpace Owner</h1>
                <div class="flex justify-between gap-x-4">
                    <button @click="openModal"
                        class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-green-500 text-white font-medium shadow hover:opacity-90 transition-all">
                        + Tambah Studio
                    </button>


                    <button @click="logout"
                        class="px-5 py-2.5 rounded-xl bg-red-500!  text-white font-medium shadow hover:opacity-90 transition-all">
                        LogOut
                    </button>

                </div>
            </header>

            <!-- STUDIO INFO CARD -->
            <div class="bg-gradient-to-r from-blue-600 to-green-500 py-5">

                <section
                    class="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 max-w-4xl mx-auto backdrop-blur-sm">

                    <!-- HEADER -->
                    <div class="mb-6">
                        <h2 class="text-2xl font-semibold text-blue-800">{{ studio.studio_name }}</h2>
                        <p class="text-sm text-black">ID: {{ studio.studio_id }}</p>
                    </div>

                    <!-- GRID INFO -->
                    <div class="grid md:grid-cols-2 gap-6">

                        <!-- ALAMAT -->
                        <div>
                            <h3 class="text-sm font-semibold text-blue-600 mb-2">Alamat Lengkap</h3>
                            <div class="space-y-1 text-slate-700">
                                <p>{{ studio.studio_address }}</p>
                                <p>{{ studio.studio_district }}, {{ studio.studio_city }}</p>
                                <p>{{ studio.studio_province }}, {{ studio.studio_postal_code }}</p>
                            </div>
                        </div>

                        <!-- CONTACT PERSON -->
                        <div>
                            <h3 class="text-sm font-semibold text-blue-600 mb-2">Contact Person</h3>
                            <div class="space-y-1 text-slate-700">
                                <p>{{ studio.studio_contact_person_name }}</p>
                                <p>{{ studio.studio_contact_person_phone }}</p>
                            </div>
                        </div>

                        <!-- ACCOUNT BANK -->
                        <div>
                            <h3 class="text-sm font-semibold text-blue-600 mb-2">Rekening Pembayaran</h3>
                            <div class="space-y-1 text-slate-700">
                                <p>{{ studio.studio_bank_name }}</p>
                                <p>No: {{ studio.studio_bank_account_number }}</p>
                            </div>
                        </div>

                        <!-- STATUS -->
                        <div>
                            <h3 class="text-sm font-semibold text-blue-600 mb-2">Status Studio</h3>
                            <span :class="[
                                'px-3 py-1 text-xs font-semibold rounded-full shadow-md',
                                studio.status === 'active'
                                    ? 'bg-green-100 text-green-700 shadow-green-300'
                                    : 'bg-red-100 text-red-700 shadow-red-300'
                            ]">
                                {{ studio.status === 'active' ? 'ACTIVE' : 'INACTIVE' }}
                            </span>
                        </div>

                    </div>
                </section>

                <!-- STUDIO NUMBER LIST SECTION -->
                <section
                    class="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 max-w-4xl mx-auto backdrop-blur-sm mt-5">

                    <h2 class="text-xl font-semibold text-slate-800 mb-4">
                        🎧 Daftar Nomor Studio
                    </h2>

                    <!-- KALAU ADA DATA -->
                    <div v-if="studioNumbers.length" class="grid md:grid-cols-2 gap-4">
                        <div v-for="sn in studioNumbers" :key="sn.id"
                            class="p-4 rounded-xl border border-slate-200 shadow hover:shadow-md transition bg-white flex justify-between items-center">
                            <div>
                                <p class="font-semibold text-slate-800">Studio #{{ sn.number }}</p>
                                <p class="text-sm text-slate-500">Tipe: {{ sn.type }}</p>
                            </div>

                            <button
                                class="px-3 py-1 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                                @click="openStudioNumberDetail(sn)">
                                Detail
                            </button>
                        </div>
                    </div>

                    <!-- KALAU BELUM PUNYA -->
                    <div v-else class="text-center py-10">
                        <p class="text-slate-500">📭 Kamu belum memiliki nomor studio.</p>
                        <p class="text-slate-400 text-sm">Silakan tambahkan nomor studio untuk memulai.</p>

                        <button
                            class="mt-4 px-4 py-2 bg-green-600! text-white rounded-xl shadow hover:bg-green-700! transition"
                            @click="addStudioNumber">
                            + Tambah Nomor Studio
                        </button>
                    </div>

                </section>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'vue-router'
import { getIpAdresses } from '../../services/axios/ip-adress.services.js'
import HeadersPage from '../HeadersPage/HeadersPage.vue'



const token = localStorage.getItem('token')
const deviceId = localStorage.getItem('device_id')
const BE_BASE_URL = import.meta.env.VITE_STUDIO_BAND_BE_BASE_URL || '/' // set env
const router = useRouter()
const showModal = ref(false)
const isInitialLoading = ref(true)



const studio = ref({
    studio_id: 12,
    studio_name: "Studio Musik Bekasi",
    studio_address: "Jalan Mawar No. 12",
    studio_district: "Bekasi Barat",
    studio_city: "Bekasi",
    studio_province: "Jawa Barat",
    studio_village: "Bekasi Timur",
    studio_postal_code: "17114",
    studio_contact_person_name: "Budi Santoso",
    studio_contact_person_phone: "08123456789",
    studio_bank_name: "BCA",
    studio_bank_account_number: "1234567890",
    status: "active"
})

function openModal() { showModal.value = true }
function closeModal() {
    showModal.value = false
}

async function fetchStudioDetail() {
    try {
        const ip = await getIpAdresses()
        const studio_uuid = router.currentRoute.value.params.studio_uuid
        const studioData = await axios({
            url: `${BE_BASE_URL}owner/studio/detail`,
            headers: {
                'authorization': `Bearer ${token}`,
                'x-device-id': deviceId,
                'x-ip-address': ip,
                'x-request-id': uuidv4()
            },
            method: 'POST',
            data: {
                studio_uuid
            }
        })

        if (studioData.data.status) {
            studio.value = studioData.data.data
        }

    } catch (error) {
        console.error(error)
        alert('Gagal memuat data studio. Silakan coba lagi.')
    }
}


function logout() {
    localStorage.clear()
    router.push('/login')
}


const studioNumbers = ref([
    // contoh dummy
    // { id: 1, number: 1, type: 'Vocal Room' },
    // { id: 2, number: 2, type: 'Band Room' }
])

function openStudioNumberDetail(sn) {
    console.log("Open Studio Number:", sn)
}

function addStudioNumber() {
    console.log("Add Studio Number Clicked")
}

onMounted(async () => {
    try {
        await Promise.all([fetchStudioDetail()])
    } finally {
        isInitialLoading.value = false
    }
})
</script>
