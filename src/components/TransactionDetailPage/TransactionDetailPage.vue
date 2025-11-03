<template>
    <MainPage>
        <!-- Header -->

        <!-- Tombol Close -->

        <button @click="router.push('/list-studio')"
            class=" bg-transparent! text-black font-extrabold p-0 m-0 leading-none outline-none focus:ring-0 border-none text-left w-[20px] h-[20px]">
            ✕
        </button>



        <div class="flex flex-col items-center text-center mb-4">
            <div class="bg-white text-blue-600 rounded-full p-3 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 11c0 .552-.448 1-1 1H7v6h10v-6h-4c-.552 0-1-.448-1-1V7h2V5h-4v2h2v4z" />
                </svg>
            </div>
            <h2 class="text-2xl font-bold text-blue-700">Rp {{ formatPrice(transactionDetail.total_payment) }}</h2>
            <p class="text-gray-500 font-medium">{{ transactionDetail.studio_name }}</p>
        </div>

        <!-- Detail Transaksi -->
        <div class=" border-blue-100 pt-4 bg-white rounded-4xl px-4 py-4">
            <h3 class="text-lg font-semibold text-blue-700 mb-3">Detail Transaksi</h3>
            <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                    <span class="text-gray-500">Status</span>
                    <span :class="[
                        'font-bold',
                        transactionDetail.status === 'cancelled'
                            ? 'text-red-600'
                            : transactionDetail.status === 'booked'
                                ? 'text-green-600'
                                : transactionDetail.status === 'pending'
                                    ? 'text-blue-400'
                                    : 'text-gray-600'
                    ]">
                        {{ transactionDetail.status }}
                    </span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-500">Studio No.</span>
                    <span class="text-gray-700">Studio {{ transactionDetail.studio_number }}</span>
                </div>

                <div class="mt-4 mb-2 font-semibold text-blue-600">Jadwal Sewa</div>

                <!-- Loop rent_time dengan kotak -->
                <div v-for="(rent, index) in transactionDetail.rent_time" :key="index"
                    class="border rounded-xl p-3 mb-2 bg-gray-100">
                    <div class="flex justify-between">
                        <span class="text-gray-500">Tanggal Sewa {{ index + 1 }}</span>
                        <span class="text-gray-700">{{ rent.date_data }}</span>
                    </div>
                    <div class="flex justify-between mt-1">
                        <span class="text-gray-500">Jam Sewa</span>
                        <span class="text-gray-700">{{ rent.duration_hour }}</span>
                    </div>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-500!">Tanggal Pembayaran</span>
                    <span class="text-gray-700">{{ transactionDetail.status === 'booked' ?
                        transactionDetail.date_payment : '-' }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-500!">Waktu Pembayaran</span>
                    <span class="text-gray-700">{{ transactionDetail.status === 'booked' ?
                        transactionDetail.hour_payment : '-' }}</span>
                </div>

                <div class="flex justify-between">
                    <span class="text-gray-500">Tipe Transaksi</span>
                    <span class="text-gray-700">QRIS</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-500">Lokasi Studio</span>
                    <span class="text-gray-700 text-right w-40">{{ transactionDetail.studio_district }} , {{
                        transactionDetail.studio_city }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-500">Booking Id</span>
                    <span class="text-gray-700">{{ transactionDetail.booking_id }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-500">Contact Person</span>
                    <span class="text-gray-700">{{ transactionDetail.contact_person_name }} / {{
                        transactionDetail.contact_person_phone }}</span>
                </div>

            </div>


        </div>
    </MainPage>

</template>

<script setup>
import MainPage from '../MainPage/MainPage.vue';
import { useRouter, useRoute } from 'vue-router'
import { onMounted, ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { getIpAdresses } from '../../services/axios/ip-adress.services';
import axios from 'axios';

const transactionDetail = ref('');
const route = useRoute()
const router = useRouter()
const BE_BASE_URL = import.meta.env.VITE_STUDIO_BAND_BE_BASE_URL;

const { booking_id } = route.params

const formatPrice = (num) => {
    return new Intl.NumberFormat('id-ID').format(num);
};


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

        const res = await axios.post(`${BE_BASE_URL}user/book/list/detail`, { booking_id }, { headers })

        if (res.data?.status) {
            transactionDetail.value = res.data.data
            return res.data.data
        } else {
            console.error('Respon tidak valid:', res.data)
            throw new Error('Gagal mengambil data transaksi')
        }
    } catch (err) {
        console.error('Fetch transaction failed:', err)
        alert('Gagal memuat detail transaksi. Silakan coba lagi.')
    }
}

onMounted(async () => {
    const token = localStorage.getItem('token')
    if (!token) {
        alert('silakan login terlebih dahulu')
        router.push('/login')
        return
    }

    await fetchTransactionDetail()

})

</script>