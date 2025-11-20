<template>

    <div v-if="isInitialLoading" class="flex-1 flex flex-col items-center justify-center">
      <div class="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p class="text-slate-500">Loading studios...</p>
    </div>

    <div v-else
        class="flex flex-col items-center justify-center py-20 px-6 text-white bg-gradient-to-br from-blue-500 via-blue-400 to-green-500 rounded-2xl shadow-lg mt-8 mx-4">
        <div class="text-center mb-10">
            <h2 class="text-3xl font-bold mb-2">{{ checkSubmissionStudioName }}</h2>
            <div class="mt-2">
                <h3 v-if="checkSubmissionStatus === 'submission'" class="text-xl font-semibold opacity-90">Pengajuan
                    Studio Sedang Diproses</h3>
                <h3 v-else-if="checkSubmissionStatus === 'rejected'" class="text-2xl font-bold text-red-100">Mohon Maaf,
                    Pengajuanmu Ditolak</h3>
                <h3 v-else-if="checkSubmissionStatus === 'accepted'" class="text-2xl font-bold text-white">Selamat!
                    Pengajuanmu Diterima!</h3>
            </div>
        </div>

        <div class="flex justify-between items-center w-full max-w-xl relative">
            <div class="absolute top-1/2 left-0 right-0 h-[2px] bg-white/30 z-0"></div>

            <div class="relative z-10 flex flex-col items-center text-center w-1/3 px-1">
                <div
                    class="w-14 h-14 flex items-center justify-center rounded-full bg-white/20 border-2 border-white/60">
                    <span class="text-lg font-semibold">1</span>
                </div>
                <p class="mt-2 text-sm font-medium">Proses Pengajuan</p>
                <p class="text-xs opacity-80 mt-1">Diajukan: {{ formatDate(checkSubmissionCreatedAt * 1000) }} | {{
                    formatTime(checkSubmissionCreatedAt * 1000) }}</p>
            </div>

            <div class="relative z-10 flex flex-col items-center text-center w-1/3 px-1">
                <div v-if="checkSubmissionStatus === 'submission'"
                    class="w-14 h-14 flex items-center justify-center rounded-full border-4 border-white animate-spin-slow">
                    <div class="w-10 h-10 bg-white/30 rounded-full">....</div>
                </div>
                <div v-else
                    class="w-14 h-14 flex items-center justify-center rounded-full bg-white/20 border-2 border-white/60">
                    <span class="text-lg font-semibold">2</span>
                </div>
                <p class="mt-2 text-sm font-medium">{{ checkSubmissionStatus === 'submission' ? 'Sedang Diproses' :
                    'Proses Selesai' }}</p>
                <p class="text-xs opacity-80 mt-1">Verifikasi oleh tim kami</p>
            </div>

            <div class="relative z-10 flex flex-col items-center text-center w-1/3 px-1">
                <div v-if="checkSubmissionStatus === 'submission'"
                    class="w-14 h-14 flex items-center justify-center rounded-full bg-white/10 border-2 border-white/40">
                    <span class="text-lg font-semibold opacity-60">3</span>
                </div>
                <div v-else-if="checkSubmissionStatus === 'rejected'"
                    class="w-14 h-14 flex items-center justify-center rounded-full bg-red-500 border-2 border-red-300">
                    <span class="text-lg font-semibold">❌</span>
                </div>
                <div v-else-if="checkSubmissionStatus === 'accepted'"
                    class="w-14 h-14 flex items-center justify-center rounded-full bg-green-500 border-2 border-green-300">
                    <span class="text-lg font-semibold">✅</span>
                </div>
                <p class="mt-2 text-sm font-medium">{{ checkSubmissionStatus === 'submission' ? 'Hasil Pengajuan' :
                    'Selesai' }}</p>
                <p class="text-xs opacity-80 mt-1">{{ checkSubmissionStatus === 'rejected' ? 'Ditolak' :
                    (checkSubmissionStatus === 'accepted' ? 'Approved' : 'Menunggu hasil') }}</p>
            </div>
        </div>

        <div class="mt-10 text-center">
            <div class="mb-4">
                <p v-if="checkSubmissionStatus === 'submission'" class="text-sm opacity-90">Kamu akan menerima
                    notifikasi
                    setelah pengajuan selesai diproses.</p>
                <p v-else-if="checkSubmissionStatus === 'rejected'" class="text-sm font-extrabold text-white">Catatan:
                    {{
                        checkSubmissionNotes || 'Tidak ada catatan spesifik.' }}, silakan ajukan ulang!</p>
            </div>

            <button v-if="checkSubmissionStatus === 'submission'"
                @click="shouldFetchData ? refreshPage() : $emit('refresh-page')"
                class="px-6 py-2 bg-white! text-black rounded-lg hover:bg-white/90 transition-all duration-200">
                Periksa Lagi
            </button>

            <button v-else-if="checkSubmissionStatus === 'rejected'" @click="$emit('open-modal')"
                class="px-6 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-all duration-200">
                Ajukan Ulang Studio
            </button>
        </div>
    </div>
</template>

<script setup>

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { submission } from '../../api/studio'

const props = defineProps({
    checkSubmissionStudioName: { type: String, default: '' },
    checkSubmissionStatus: { type: String, default: '' },
    checkSubmissionCreatedAt: { type: Number, default: null },
    showModal: { type: Boolean, default: false }
})

const checkSubmissionStudioName = ref(props.checkSubmissionStudioName || '')
const checkSubmissionStatus = ref(props.checkSubmissionStatus || '')
const checkSubmissionCreatedAt = ref(props.checkSubmissionCreatedAt || null)
const showModal = ref(props.showModal || false)

const shouldFetchData = ref(
    !props.checkSubmissionCreatedAt &&
    !props.checkSubmissionStatus &&
    !props.checkSubmissionStudioName
)

const isInitialLoading = ref(true)


function formatDate(timestamp) {
    if (!timestamp) return '-'
    return new Date(timestamp).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })
}

function refreshPage() {
    window.location.reload()
}

function openModal() {
    showModal.value = true
}

function formatTime(timestamp) {
    if (!timestamp) return '-'
    return new Date(timestamp).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    })
}

async function checkSubmission() {
    try {
        const response = await submission()

        if (response.data.status) {
            checkSubmissionStatus.value = response.data.data.status
            checkSubmissionStudioName.value = response.data.data.studio_name
            checkSubmissionCreatedAt.value = response.data.data.created_at
        }

    } catch (err) {
        console.error('Error checking submission:', err)
    }
}

onMounted(async () => {
    try {
        if (shouldFetchData.value) {
            await Promise.all([checkSubmission()])
        }
    } finally {
        isInitialLoading.value = false
    }
})

</script>

<style scoped>
@keyframes spin-slow {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.animate-spin-slow {
    animation: spin-slow 3s linear infinite;
}
</style>