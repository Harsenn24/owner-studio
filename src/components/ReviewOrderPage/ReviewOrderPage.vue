<template>
    <MainPage>
        <HomePageTab v-model:activeTab="activeTab" class="sticky top-0" />


        <!-- Header -->
        <div class="sticky top-0 z-10 bg-white bg-opacity-90 backdrop-blur rounded-xl shadow-md p-4 space-y-3">
            <h2 class="text-xl font-bold text-black">REVIEW ORDER</h2>
        </div>

        <!-- Studio Booking Card -->
        <div
            class="bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl shadow-md border border-blue-600 overflow-hidden">
            <!-- Studio Info -->
            <div class="p-4 border-b border-blue-200 text-left">
                <p class="text-sm font-semibold text-blue-600">{{ studioName.toUpperCase() }}</p>
                <p class="text-xs text-gray-500">⭐ {{ studioRating }} • KOTA {{ studioCity.toUpperCase() }}</p>
            </div>

            <!-- Booked Schedule -->
            <div class="p-4 space-y-2 text-left">
                <p class="text-sm font-semibold text-gray-800">Booked Schedule</p>

                <!-- Nama Studio -->
                <div class="text-sm text-gray-700 font-medium">Studio 1</div>

                <!-- Tanggal -->
                <div v-for="(book, index) in bookingData" :key="index" class="mb-4">
                    <!-- Format Hari, Tanggal -->
                    <div class="text-xs text-gray-500">
                        {{ book.date }}
                    </div>

                    <!-- Jam dan Harga -->
                    <div class="flex justify-between items-center bg-blue-50 p-3 rounded-md text-sm text-gray-700">
                        <span class="text-sm">{{ book.hour }}</span>
                        <span class="font-semibold text-blue-600">Rp {{ book.price }}</span>
                    </div>
                </div>

                <!-- Add Booking Button -->
                <!-- <button
                    class="w-full text-black !text-sm mt-2 font-medium hover:underline text-left !bg-white border !border-black rounded">
                    + Add Booking
                </button> -->
            </div>
        </div>

        <!-- Payment Summary -->
        <div
            class="bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl shadow-md border border-blue-600 p-4">
            <p class="text-sm font-semibold text-gray-800 mb-2">Payment Summary</p>
            <div class="flex justify-between text-sm text-gray-700">
                <span>Rental Cost</span>
                <span>Rp {{ formatPrice(price) }}</span>
            </div>
            <div class="flex justify-between text-sm text-gray-700">
                <span>Add-on Fee</span>
                <span>Rp {{ formatPrice(feeAdmin) }}</span>
            </div>
            <div class="flex justify-between font-semibold text-gray-900 mt-2">
                <span>Total</span>
                <span>Rp {{ formatPrice(totalPrice) }}</span>
            </div>
        </div>

        <!-- Payment Method -->
        <div
            class="bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl shadow-md border border-blue-600 p-4">
            <p class="text-sm font-semibold text-gray-800 mb-2">Set Payment</p>
            <div class="flex items-center space-x-2">
                <input type="radio" checked class="text-blue-600 focus:ring-0" />
                <label class="text-sm text-gray-700">Pay in Full</label>
                <span class="ml-auto font-semibold text-blue-600">Rp {{ formatPrice(totalPrice) }}</span>
            </div>
        </div>

        <!-- Submit Button -->
        <div>
            <button @click="handlePayment"
                class="w-full !bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md transition duration-300">
                Payment
            </button>
        </div>

    </MainPage>

</template>





<script setup>

import { useRouter, useRoute } from 'vue-router'
import HomePageTab from "../HomePageTab/HomePageTab.vue";
import { onMounted, ref, watch } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { getIpAdresses } from '../../services/axios/ip-adress.services';
import axios from 'axios';
import MainPage from '../MainPage/MainPage.vue';




const route = useRoute()
const router = useRouter()
const BE_BASE_URL = import.meta.env.VITE_STUDIO_BAND_BE_BASE_URL;


const activeTab = ref('');
const studioNumber = ref('');
const studioName = ref('')
const studioRating = ref('');
const studioCity = ref('');
const bookingData = ref([]);
const price = ref(0);
const feeAdmin = ref(0);
const totalPrice = ref(0);

const { studioId, studioNumberId, bookings } = route.query

const formatPrice = (num) => {
    return new Intl.NumberFormat('id-ID').format(num);
};

watch(activeTab, (newValue) => {
    router.push({path : `/list-studio`, query: { tab: newValue }});
});


const fetchStudioData = async () => {

    const payload = {
        studio_uuid: studioId,
        studio_number_uuid: studioNumberId
    }

    const headers = {
        'x-request-id': uuidv4(),
        'x-device-id': localStorage.getItem('device_id'),
        'x-ip-address': await getIpAdresses()
    }

    const res = await axios.post(`${BE_BASE_URL}user/studio/list/studio-number/detail`, payload, { headers })
    if (!res.data.message) alert("Data studio tidak ditemukan")

    studioNumber.value = res.data.data.studio_number
    studioName.value = res.data.data.studio_name
    studioRating.value = res.data.data.studio_rating
    studioCity.value = res.data.data.studio_address.city
    feeAdmin.value = res.data.data.fee_admin

    const dataBooking = JSON.parse(bookings)

    const payloadBookings = dataBooking.map((booking) => {
        return {
            price: booking.price,
            date_id: booking.date_id,
            hour_id: booking.hour_id
        }
    })

    const resBookings = await axios.post(`${BE_BASE_URL}user/time/order-detail`, { orderTimeDatas: payloadBookings }, { headers })
    const bookingDateData = resBookings.data.data


    let sumPrice = 0

    for (let i = 0; i < dataBooking.length; i++) {
        const element = dataBooking[i];

        bookingData.value.push({
            price: element.price,
            date: bookingDateData[i].date,
            hour: bookingDateData[i].hour
        })

        sumPrice += element.price

    }

    price.value = sumPrice

    totalPrice.value = sumPrice + feeAdmin.value


}

const handlePayment = async () => {
    try {
        const token = localStorage.getItem('token')
        if (!token) {
            alert('Silakan login dulu sebelum melakukan pembayaran.')
            router.push('/login')
            return
        }

        const headers = {
            'Authorization': `Bearer ${token}`,
            'x-request-id': uuidv4(),
            'x-device-id': localStorage.getItem('device_id'),
            'x-ip-address': await getIpAdresses()
        }

        const dataMap = JSON.parse(bookings).map((el) => {
            return {
                date_id: el.date_id,
                start_hour_id: el.hour_id,
                studio_number_uuid: studioNumberId
            }
        })

        const payload = {
            book_datas: dataMap
        }


        const res = await axios.post(`${BE_BASE_URL}user/book`, payload, { headers })

        if (res.data.status) {
            const transactionId = res.data.data?.transaction_uuid

            router.push({
                path: '/order/payment',
                query: { transactionId }
            })
        } else {
            alert(res.data.message || 'Payment gagal.')
        }
    } catch (err) {
        console.error(err)
        alert('Terjadi kesalahan saat payment.')
    }
}



onMounted(async () => {
    const token = localStorage.getItem('token')
    if (!token) {
        alert('silakan login terlebih dahulu')
        router.push('/login')
        return
    }

    await fetchStudioData()

})
</script>