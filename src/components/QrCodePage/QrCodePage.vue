<template>
    <MainPage>
        <!-- Header -->
        <HomePageTab v-model:activeTab="activeTab" class="sticky top-0" />

        <div class="sticky top-0 z-10 bg-blue-400 bg-opacity-90 backdrop-blur rounded-xl shadow-md p-4 space-y-3">
            <h2 class="text-xl font-bold text-white">PAYMENT</h2>
        </div>

        <!-- Payment Method -->
        <div
            class="bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl shadow-md border border-blue-600 p-4 space-y-2">
            <!-- QRIS Payment Section -->
            <div class="text-center border-t pt-4">
                <p class="text-sm font-semibold text-gray-800 mb-3">Scan QRIS to Pay</p>

                <!-- Kondisi QR -->
                <div v-if="statusTrx === 'booked'" class="flex items-center justify-center mx-auto
            rounded-xl border border-gray-300 shadow-sm
            w-[180px] h-[180px] bg-blue-50 text-blue-600 font-bold text-lg
            animate-glow">
                    QR HAS BEEN PAID
                </div>

                <div v-else-if="isExpired" class="flex items-center justify-center mx-auto
            rounded-xl border border-gray-300 shadow-sm
            w-[180px] h-[180px] bg-gray-200 text-red-600 font-semibold">
                    QR EXPIRED
                </div>

                <div v-else class="flex justify-center">
                    <qrcode-vue :value="qrValue" :size="180" level="M"
                        class="rounded-xl border border-gray-300 shadow-sm" />
                </div>

                <!-- Countdown -->
                <div v-if="!isExpired && statusTrx !== 'booked'"
                    class="mt-4 mb-2 inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    {{ countdownDisplay }}
                </div>

                <!-- Info QR -->
                <p v-if="!isExpired && statusTrx !== 'booked'" class="mt-3 text-xs text-gray-500">
                    Use any QRIS-compatible app to complete payment
                </p>
            </div>
        </div>

        <!-- Transaction Info -->
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-4 text-center space-y-2">
            <p class="text-sm text-gray-500 font-medium">Transaction ID : {{ transactionId }}</p>

            <div class="border-t my-2"></div>

            <p class="text-2xl font-bold text-blue-600">
                Total Payment : Rp {{ formatPrice(totalPayment) }}
            </p>
        </div>
    </MainPage>
</template>

<script setup>
import MainPage from '../MainPage/MainPage.vue'
import HomePageTab from "../HomePageTab/HomePageTab.vue";
import QrcodeVue from 'qrcode.vue'
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getIpAdresses } from '../../services/axios/ip-adress.services'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'

// Router & query
const route = useRoute()
const router = useRouter()
const BE_BASE_URL = import.meta.env.VITE_STUDIO_BAND_BE_BASE_URL
const activeTab = ref('');

// State utama
const qrValue = ref('')
const transactionId = ref('')
const totalPayment = ref(0)
const countdown = ref(0)
const isExpired = ref(false)
const statusTrx = ref('')

let timer = null
let pollingInterval = null // ⬅️ tambahkan baris ini


watch(activeTab, (newValue) => {
    router.push({ path: `/list-studio`, query: { tab: newValue } });
});



// === Fungsi Fetch Data Transaksi ===
const fetchTransactionDetail = async () => {
    try {
        const token = localStorage.getItem('token')
        if (!token) {
            alert('Silakan login dulu sebelum melakukan pembayaran.')
            router.push('/login')
            return
        }

        const headers = {
            Authorization: `Bearer ${token}`,
            'x-request-id': uuidv4(),
            'x-device-id': localStorage.getItem('device_id'),
            'x-ip-address': await getIpAdresses(),
        }

        const payload = { booking_id: route.query.transactionId }

        const res = await axios.post(`${BE_BASE_URL}user/book/list/detail`, payload, { headers })

        if (res.data?.status) {
            return res.data.data
        } else {
            console.error('Respon tidak valid:', res.data)
            throw new Error('Gagal mengambil data transaksi')
        }
    } catch (err) {
        console.error('Fetch transaction failed:', err)
        alert('Gagal memuat detail transaksi. Silakan coba lagi.')
        return null
    }
}

const startPollingStatus = () => {
    pollingInterval = setInterval(async () => {
        const trxData = await fetchTransactionDetail()
        if (!trxData) return

        statusTrx.value = trxData.status

        // Jika sudah dibayar, arahkan ke halaman booking
        if (statusTrx.value === 'booked') {
            clearInterval(pollingInterval)
            router.push(`/booking/${trxData.booking_id}`)
        }
    }, 5000)
}

// === Ambil data di onMounted ===
onMounted(async () => {
    const transactionData = await fetchTransactionDetail()
    if (!transactionData) return


    qrValue.value = transactionData.payment_link
    transactionId.value = transactionData.booking_id
    totalPayment.value = transactionData.total_payment
    statusTrx.value = transactionData.status


    // Hitung countdown dari epoch
    const currentEpoch = Math.floor(Date.now() / 1000)
    const expiryEpoch = transactionData.expired_qr
    countdown.value = expiryEpoch - currentEpoch

    // Jalankan timer countdown
    timer = setInterval(() => {
        const now = Math.floor(Date.now() / 1000)
        countdown.value = expiryEpoch - now

        if (countdown.value <= 0) {
            isExpired.value = true
            countdown.value = 0
            clearInterval(timer)
            timer = null
        }
    }, 1000)

    startPollingStatus()
})

// === Cleanup ===
onBeforeUnmount(() => {
    if (timer) clearInterval(timer)
    if (pollingInterval) clearInterval(pollingInterval)

})

// === Computed untuk tampil countdown ===
const countdownDisplay = computed(() => {
    if (countdown.value <= 0) return '0 detik'

    const min = Math.floor(countdown.value / 60)
    const sec = countdown.value % 60

    if (min > 0) {
        return `${min}:${sec.toString().padStart(2, '0')} menit`
    } else {
        return `${countdown.value} detik`
    }
})

// === Formatter harga ===
const formatPrice = (num) => new Intl.NumberFormat('id-ID').format(num)
</script>

<style scoped>
::-webkit-scrollbar {
    height: 6px;
}

::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 3px;
}

/* Animasi glow biru halus */
@keyframes glow {
    0% {
        box-shadow: 0 0 5px rgba(59, 130, 246, 0.4), 0 0 10px rgba(59, 130, 246, 0.3);
    }

    50% {
        box-shadow: 0 0 15px rgba(59, 130, 246, 0.6), 0 0 25px rgba(59, 130, 246, 0.5);
    }

    100% {
        box-shadow: 0 0 5px rgba(59, 130, 246, 0.4), 0 0 10px rgba(59, 130, 246, 0.3);
    }
}

.animate-glow {
    animation: glow 2s ease-in-out infinite;
}
</style>
