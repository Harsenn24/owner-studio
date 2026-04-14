<template>
    <div class="min-h-screen flex flex-col bg-gradient-to-b from-white via-gray-50 to-gray-100 p-6">

        <!-- TITLE -->
        <div v-if="isInitialLoading" class="flex-1 flex flex-col items-center justify-center">
            <div class="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p class="text-slate-500">Loading studios...</p>
        </div>

        <template v-else>

            <HeadersPage @open-modal="openModal" @logout="logout" />



            <ProfilPage v-if="activeTab === 'profil'" :studio="studio" :studioNumbers="studioNumbers"
                :estimatedStudios="estimatedStudios" :BE_BASE_URL="BE_BASE_URL" :formatRupiah="formatRupiah"
                @open-payment="showModalPaymentSubscribe = true" @add-studio="addStudioNumber"
                @edit-studio="openStudioNumberDetail" />


            <transition name="modal-fade">
                <ModalAddStudioPage v-if="showModal" @close-modal="closeModal" />
            </transition>

            <transition name="modal-fade">
                <PaymentSubscribeModalPage v-if="showModalPaymentSubscribe"
                    @close-modal="showModalPaymentSubscribe = false" />
            </transition>


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
import ModalAddStudioPage from '../ModalAddStudioPage/ModalAddStudioPage.vue'
import { studioNumberOwner, submission } from '../../api/studio.js'
import PaymentSubscribeModalPage from '../PaymentSubscribeModal/PaymentSubscribeModalPage.vue'
import ProfilPage from './Tab/ProfilPage.vue'

const token = localStorage.getItem('token')
const deviceId = localStorage.getItem('device_id')
const BE_BASE_URL = import.meta.env.VITE_STUDIO_BAND_BE_BASE_URL || '/' // set env
const router = useRouter()
const showModal = ref(false)
const isInitialLoading = ref(true)

const estimatedStudios = ref(null)
const studioNumbers = ref([])
const checkSubmissionStatus = ref('')

const showModalPaymentSubscribe = ref(false)

const studio_uuid = router.currentRoute.value.params.studio_uuid

const activeTab = ref('profil') // default tab pertama


const sn = ref({
    id: null,
    number: null,
    type: null
})

const studio = ref({
    studio_id: null,
    studio_name: "",
    studio_address: "",
    studio_district: "",
    studio_city: "",
    studio_province: " ",
    studio_village: " ",
    studio_postal_code: "",
    studio_contact_person_name: " ",
    studio_contact_person_phone: "",
    studio_bank_name: "",
    studio_bank_account_number: "",
    status: ""
})


function openModal() { showModal.value = true }
function closeModal() {
    showModal.value = false
}

async function fetchStudioNumbers() {
    try {
        const response = await studioNumberOwner(studio_uuid);

        studioNumbers.value = response?.data?.data?.data ?? [];

    } catch (error) {
        console.error(error);
        studioNumbers.value = [];
        alert('Gagal memuat data studio number.');
    }
}

async function fetchSubmission() {
    try {
        const response = await submission()
        if (response.data.status) {
            checkSubmissionStatus.value = response.data.data.status
        }
    } catch (error) {
        console.error(error)
        alert('Gagal memuat status pengajuan. Silakan coba lagi.')
    }
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
            estimatedStudios.value = studioData.data.data.estimated_studio_number
        }

    } catch (error) {
        console.error(error)
        alert('Gagal memuat data studio. Silakan coba lagi.')
    }
}


function logout() {
    localStorage.clear()
    window.location.href = '/login'
}


function openStudioNumberDetail(sn) {
    const studio_uuid = router.currentRoute.value.params.studio_uuid
    const studio_number_uuid = sn.id
    router.push(`/home/${studio_uuid}/${studio_number_uuid}`)
    // console.log("Open Studio Number:", sn)
}

const formatRupiah = (value) => {
    if (!value) return 'Rp 0'
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(value)
}

function addStudioNumber() {
    const studio_uuid = router.currentRoute.value.params.studio_uuid
    router.push(`/home/create-studio-detail/${studio_uuid}`)
}

onMounted(async () => {
    try {
        await Promise.all([fetchStudioNumbers(), fetchStudioDetail(), fetchSubmission()])
    } finally {
        isInitialLoading.value = false
    }
})
</script>
