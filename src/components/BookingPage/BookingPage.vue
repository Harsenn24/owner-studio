<template>
    <MainPage>
        <div class="sticky top-0 z-20 bg-white pb-2  w-full rounded-2xl">
            <HomePageTab v-model:activeTab="activeTab" class="sticky top-0" />
            <!-- Nama Studio -->
            <div class="text-left mt-5">
                <p class="text-2xl font-serif text-black text-center font-bold ">{{ studioName.toUpperCase()
                    }}
                </p>
                <hr class="border-t border-black w-1/2 mx-auto my-1" />
                <p class="text-1xl text-black text-center font-semibold font-serif">Studio {{ studioNumber }}
                </p>
            </div>

            <!-- Date Picker -->
            <div class="mt-2 flex space-x-2 overflow-x-auto text-black ml-2 mr-2">
                <div v-for="date in dates" :key="date.id"
                    class="min-w-[80px] text-center px-2 py-1 border rounded cursor-pointer"
                    :class="{ 'bg-blue-200 font-semibold': selectedDateId === date.id }"
                    @click="selectedDateId = date.id; fetchAvailability();">
                    {{ formatDate(date.date) }}
                </div>
            </div>
        </div>

        <!-- Booking List (Jam dan Harga ke Bawah) -->
        <div class="border border-gray-300 rounded-xl overflow-hidden shadow-md bg-slate-50 divide-y">
            <div v-for="hour in hours" :key="hour.id" class="grid grid-cols-[100px_1fr] items-center">
                <!-- Jam -->
                <div class="p-2 font-medium text-white" :class="{
                    'bg-red-700': !getAvailability(hour.id)?.price, // tidak ada price
                    'bg-blue-700': getAvailability(hour.id)?.booked, // sudah dibooking
                    'bg-green-700': getAvailability(hour.id)?.price && !getAvailability(hour.id)?.booked // tersedia
                }">
                    {{ hour.hour_time }}
                </div>

                <!-- Harga dan Status -->
                <div class="p-2 text-center transition-all duration-300 border-l text-black select-none" :class="{
                    'bg-blue-500 text-white cursor-pointer': isSelected(hour.id),
                    'bg-gray-300 text-gray-600 pointer-events-none':
                        getAvailability(hour.id)?.booked || isPastHour(hour.hour_time) || !getAvailability(hour.id)?.price,
                    'hover:bg-gray-100 cursor-pointer':
                        !getAvailability(hour.id)?.booked && !isPastHour(hour.hour_time) && getAvailability(hour.id)?.price
                }"
                    @click="!isPastHour(hour.hour_time) && !getAvailability(hour.id)?.booked && getAvailability(hour.id)?.price && selectSlot(hour.id)">
                    <div class="font-semibold">
                        {{ getAvailability(hour.id)?.price ? formatPrice(getAvailability(hour.id).price) : '-' }}
                    </div>

                    <hr class="my-1 border-t border-dashed border-gray-400" />

                    <!-- kondisi booked -->
                    <div class="text-xs text-blue-500 font-bold" v-if="getAvailability(hour.id)?.booked">
                        Booked by {{ getAvailability(hour.id)?.booked_by.toUpperCase() }}
                    </div>

                    <!-- kondisi sudah lewat tapi memang ada price -->
                    <div class="text-xs text-red-600"
                        v-else-if="isPastHour(hour.hour_time) && getAvailability(hour.id)?.price">
                        Jam Tidak Tersedia
                    </div>
                </div>



            </div>
        </div>

        <!-- Total Harga -->
        <div class="mt-4 flex justify-between items-center">
            <div class="font-semibold text-lg text-gray-800">
                Total Cost: <span class="text-blue-600">{{ formatPrice(totalPrice) }}</span>
            </div>
            <button class="w-48 px-4 py-2 rounded-lg font-semibold transition-colors duration-300
         !bg-blue-600 !text-white
         hover:!bg-blue-700
         " :disabled="selectedSlots.length === 0" @click="goToNextPage">
                Next
            </button>
        </div>


    </MainPage>

</template>


<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import HomePageTab from "../HomePageTab/HomePageTab.vue";
import { useRoute } from 'vue-router';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { getIpAdresses } from '../../services/axios/ip-adress.services';
import { useRouter } from 'vue-router';
import MainPage from '../MainPage/MainPage.vue';
import dayjs from 'dayjs';
dayjs.locale('id');




const route = useRoute();
const router = useRouter();
const BE_BASE_URL = import.meta.env.VITE_STUDIO_BAND_BE_BASE_URL;

const activeTab = ref('');
const dates = ref([]);
const hours = ref([]);
const availabilities = ref([]);

const studioNumber = ref('');
const studioName = ref('');

const selectedDateId = ref(null);
const selectedSlots = ref([]);

const currentTime = ref(dayjs()); // waktu lokal sekarang

setInterval(() => {
    currentTime.value = dayjs();
}, 60 * 1000);

watch(activeTab, (newValue) => {
    router.push({ path: `/list-studio`, query: { tab: newValue } });
});

// cek apakah jam sudah lewat (hari ini)
const isPastHour = (hourTime) => {
    const selectedDate = dates.value.find(d => d.id === selectedDateId.value);
    if (!selectedDate) return false;

    const now = dayjs(); // waktu sekarang
    const selected = dayjs(selectedDate.date); // tanggal yang dipilih

    if (selected.isBefore(now, 'day')) {
        return true;
    }

    if (selected.isAfter(now, 'day')) {
        return false;
    }

    const [hour, minute] = hourTime.split(':').map(Number);
    const currentHour = now.hour();
    const currentMinute = now.minute();

    return hour < currentHour || (hour === currentHour && minute <= currentMinute);
};

const handleSlotClick = (hour) => {
    if (isPastHour(hour.hour_time)) {
        alert('Jam sudah lewat, silakan pilih jam lain.');
        return;
    }

    const availability = getAvailability(hour.id);
    if (availability?.price && !availability?.booked) {
        selectSlot(hour.id);
    }
};



const fetchDates = async () => {
    const res = await axios.get(`${BE_BASE_URL}user/time/date/list-three-months`);
    dates.value = res.data.data;
    selectedDateId.value = dates.value[0]?.id;
};

const fetchHours = async () => {
    const res = await axios.get(`${BE_BASE_URL}user/time/hour/list`);
    hours.value = res.data.data;
};

const fetchAvailability = async () => {
    const ipAddress = await getIpAdresses();

    if (!selectedDateId.value) return;

    const results = [];

    for (const hour of hours.value) {
        const payload = {
            studio_number_uuid: route.params.studioNumberId,
            date_id: selectedDateId.value,
            hour_id: hour.id
        };

        const headers = {
            'x-request-id': uuidv4(),
            'x-device-id': localStorage.getItem('device_id'),
            'x-ip-address': ipAddress
        };

        const res = await axios.post(`${BE_BASE_URL}user/studio/check-availability`, payload, { headers });

        results.push({
            hourId: hour.id,
            ...res.data.data[0],
        });
    }

    availabilities.value = [...results];
};

const fetchStudioData = async () => {
    const payload = {
        studio_uuid: route.params.studioId,
        studio_number_uuid: route.params.studioNumberId
    }

    const headers = {
        'x-request-id': uuidv4(),
        'x-device-id': localStorage.getItem('device_id'),
        'x-ip-address': await getIpAdresses()
    }

    const res = await axios.post(`${BE_BASE_URL}user/studio/list/studio-number/detail`, payload, { headers })
    studioNumber.value = res.data.data.studio_number
    studioName.value = res.data.data.studio_name

}

const getAvailability = (hourId) => {
    return availabilities.value.find(a => a.hourId == hourId);
};

const isSelected = (hourId) => {
    return selectedSlots.value.some(s => s.hourId === hourId && s.dateId === selectedDateId.value);
};

const selectSlot = (hourId) => {
    const availability = getAvailability(hourId);
    if (!availability || availability.booked || !availability.price) return;

    const index = selectedSlots.value.findIndex(
        s => s.hourId === hourId && s.dateId === selectedDateId.value
    );

    if (index > -1) {
        selectedSlots.value.splice(index, 1);
    } else {
        selectedSlots.value.push({
            hourId,
            availableId: availability.id,
            price: Number(availability.price),
            dateId: selectedDateId.value
        });
    }
};


const totalPrice = computed(() => {
    return selectedSlots.value.reduce((acc, cur) => acc + Number(cur.price), 0);
});

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
};

const formatPrice = (num) => {
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(num);
};

const goToNextPage = () => {
    const bookingData = selectedSlots.value.map(slot => ({
        hour_id: slot.hourId,
        date_id: slot.dateId,
        price: slot.price
    }));

    router.push({
        path: '/order',
        query: {
            studioId: route.params.studioId,
            studioNumberId: route.params.studioNumberId,
            bookings: JSON.stringify(bookingData)
        }
    });
};


onMounted(async () => {
    await fetchDates();
    await fetchHours();
    await fetchAvailability();
    await fetchStudioData()

});
</script>

<style scoped>
::-webkit-scrollbar {
    height: 6px;
}

::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 3px;
}
</style>