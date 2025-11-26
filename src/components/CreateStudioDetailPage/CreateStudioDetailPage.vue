<template>
    <div class="min-h-screen bg-gradient-to-b from-white to-gray-50 py-10 px-6 flex flex-col gap-10">
        <HeadersPage />

        <h1 class="text-3xl font-bold text-slate-800 text-center">🎵 Register Studio</h1>

        <!-- STEP 1: Pilih Equipment -->
        <section class="bg-gradient-to-r from-green-600 to-blue-500 shadow rounded-2xl p-6">
            <h2 class="text-xl font-semibold text-white mb-4">1️⃣ Pilih & Atur Jumlah Alat Musik</h2>
            <div v-if="equipments.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="eq in equipments" :key="eq.equipment_id"
                    class="p-4 border rounded-xl flex justify-between items-center hover:shadow-md transition bg-white">
                    <div>
                        <p class="font-medium text-slate-800">{{ eq.equipment_name }}</p>
                    </div>
                    <input type="number" min="0" v-model.number="selectedEquipments[eq.equipment_id]"
                        class="w-20 rounded-lg border px-2 py-1 text-center text-sm border-gray-400 text-black" />
                </div>
            </div>
            <p v-else class="text-gray-500 italic text-sm">Loading equipment...</p>
        </section>

        <!-- STEP 2: Harga Weekend/Weekday -->
        <section class="bg-gradient-to-r from-green-600 to-blue-500 shadow rounded-2xl p-6">
            <h2 class="text-xl font-semibold mb-4 text-white">2️⃣ Atur Harga Sewa</h2>
            <div class="flex flex-col md:flex-row gap-6">
                <div class="flex-1 bg-white rounded-lg p-4">
                    <label class="block text-sm font-medium text-black">Harga Weekday</label>
                    <input type="number" v-model.number="prices.weekday"
                        class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-gray-400 text-black"
                        placeholder="Contoh: 50000" />
                </div>
                <div class="flex-1 bg-white rounded-lg p-4">
                    <label class="block text-sm font-medium text-black">Harga Weekend</label>
                    <input type="number" v-model.number="prices.weekend"
                        class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-gray-400 text-black"
                        placeholder="Contoh: 50000" />
                </div>
            </div>
        </section>

        <!-- STEP 3: Jam Operasional -->
        <section class="bg-gradient-to-r from-green-600 to-blue-500 shadow rounded-2xl p-6">
            <div class="flex justify-between items-center">
                <h2 class="text-xl font-semibold text-white mb-4">3️⃣ Atur Jam Operasional</h2>

                <button class="text-xl font-semibold text-white mb-4 px-3 py-1 rounded"
                    :class="{ 'opacity-50 cursor-not-allowed': !canAddOperational }" :disabled="!canAddOperational"
                    @click="addOperational" aria-disabled="!canAddOperational">
                    + Tambah Jam Operasional
                </button>
            </div>

            <div v-for="(op, index) in operationalList" :key="op.uid" class="space-y-4 mb-6">

                <button v-if="operationalList.length > 1" @click="removeOperational(index)"
                    class="text-xs bg-red-500! text-white ml-2">
                    Hapus
                </button>

                <div class="flex flex-col md:flex-row gap-4 items-start">

                    <!-- Tanggal -->
                    <div class="flex-1 bg-white rounded-lg p-4">
                        <label class="block text-sm font-medium text-slate-600">Tanggal</label>

                        <select v-model="op.date"
                            class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-gray-400 text-black">
                            <option disabled value="">Pilih tanggal</option>

                            <option v-for="d in filteredDates(index)" :key="d.date_id" :value="d.date">
                                {{ d.date }}
                            </option>
                        </select>

                        <p v-if="op.date && usedDateCount(op.date) > 1" class="text-xs text-red-600 mt-1">
                            Tanggal sudah dipakai.
                        </p>
                    </div>

                    <!-- Jam Buka -->
                    <div class="flex-1 bg-white rounded-lg p-4">
                        <label class="block text-sm font-medium text-slate-600">Jam Buka</label>

                        <select v-model="op.open"
                            class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-gray-400 text-black">
                            <option disabled value="">Pilih Jam Buka</option>

                            <option v-for="h in hours" :key="h.id" :value="h.hour_time">
                                {{ h.hour_time }}
                            </option>
                        </select>
                    </div>

                    <!-- Jam Tutup -->
                    <div class="flex-1 bg-white rounded-lg p-4">
                        <label class="block text-sm font-medium text-slate-600">Jam Tutup</label>

                        <select v-model="op.close"
                            class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-gray-400 text-black">
                            <option disabled value="">Pilih Jam Tutup</option>

                            <option v-for="h in hours" :key="h.id" :value="h.hour_time">
                                {{ h.hour_time }}
                            </option>
                        </select>

                        <p v-if="op.open && op.close && !validTime(op)" class="text-xs text-red-600 mt-1">
                            Jam buka harus lebih kecil dari jam tutup.
                        </p>
                    </div>


                </div>
            </div>
            <p class="text-sm font-bold text-white mt-1">
                CATATAN : <br></br>
                1. pastikan jam buka dan tutup sesuai dengan jam operasional studio. <br>
                2. jam buka harus lebih kecil dari jam tutup. <br>
                3. setiap tanggal hanya bisa dipilih sekali saja. <br>
                4. jika ingin menambah jam operasional, klik tombol "Tambah Jam Operasional". <br>
                5. jika ingin menghapus jam operasional, klik tombol "Hapus". <br>
                6. jam operasional yang sudah diatur tidak bisa diubah setelah disimpan. <br>
                7. Jika jam buka pukul 09:00 dan jam tutup pukul 18:00, maka penyewaan dibagi per 1 Jam.
            </p>

        </section>

        <!-- STEP 4: Pilih Gambar Studio -->
        <section class="bg-white shadow rounded-2xl p-6">
            <h2 class="text-xl font-semibold text-slate-700 mb-4">4️⃣ Pilih Foto Studio</h2>
            <div v-if="documents.length" class="grid md:grid-cols-3 gap-4">
                <div v-for="doc in documents" :key="doc.id"
                    class="relative rounded-xl overflow-hidden border-2 transition cursor-pointer"
                    :class="doc.id === selectedDocumentId ? 'border-blue-500 shadow-lg' : 'border-gray-300'"
                    @click="selectedDocumentId = doc.id">
                    <img :src="`${BE_BASE_URL}uploads/${doc.file_name}`" class="w-full h-40 object-cover" />
                </div>
            </div>
            <p v-else class="text-gray-500 italic text-sm">Menunggu data gambar...</p>
        </section>

        <!-- Submit -->
        <div class="text-center">
            <button @click="submit" :disabled="loading"
                class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow">
                {{ loading ? 'Menyimpan...' : '💾 Simpan Detail Studio' }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'vue-router'
import { getIpAdresses } from '../../services/axios/ip-adress.services.js'
import HeadersPage from '../HeadersPage/HeadersPage.vue'



const router = useRouter()

// ---------- CONFIG ----------
const BE_BASE_URL = import.meta.env.VITE_STUDIO_BAND_BE_BASE_URL || '/' // set env

// ---------- STATE ----------
const equipments = ref([])
const selectedEquipments = reactive({}) // keys: equipment_id -> qty

const prices = reactive({ weekday: '', weekend: '' })

const dates = ref([]) // expect array of { date_id, date } where date is 'YYYY-MM-DD'
const documents = ref([])
const selectedDocumentId = ref(null)

const hours = ref([]) // optional, if you want to predefine hours

const loading = ref(false)

// operational rows
const operationalList = ref([
    { uid: uuidv4(), date: '', open: '', close: '' } // uid used as key
])

// refs registry for time inputs
const inputRefs = ref({})

// ---------- HELPERS ----------


function addOperational() {
    if (!canAddOperational.value) return
    operationalList.value.push({ uid: uuidv4(), date: '', open: '', close: '' })
}

function removeOperational(idx) {
    operationalList.value.splice(idx, 1)
}

// return how many rows use the same date
function usedDateCount(dateStr) {
    return operationalList.value.filter(r => r.date === dateStr).length
}

function filteredDates(currentIndex) {
    const usedDates = operationalList.value
        .map((d, i) => (i === currentIndex ? null : d.date))
        .filter(Boolean)
    // dates may be array of objects like { date_id, date }
    return dates.value.filter(d => !usedDates.includes(d.date))
}

function validTime(op) {
    if (!op.open || !op.close) return true
    // compare "HH:MM"
    const [oh, om] = op.open.split(':').map(Number)
    const [ch, cm] = op.close.split(':').map(Number)
    const openMinutes = oh * 60 + om
    const closeMinutes = ch * 60 + cm
    return openMinutes < closeMinutes
}

// ---------- COMPUTED ----------
const canAddOperational = computed(() => {
    const last = operationalList.value[operationalList.value.length - 1]
    // require last row to have all fields and valid times
    return last && last.date && last.open && last.close && validTime(last)
})

// ---------- API ----------
async function fetchEquipment() {
    try {
        const res = await axios.get(`${BE_BASE_URL}owner/studio/equipment/list`)
        // adapt to your API shape
        equipments.value = res.data?.data || []
        // init selectedEquipments keys
        equipments.value.forEach(e => {
            if (!(e.equipment_id in selectedEquipments)) selectedEquipments[e.equipment_id] = 0
        })
    } catch (err) {
        console.error(err)
        alert('Gagal memuat equipment')
    }
}

async function fetchDate() {
    try {
        const res = await axios.get(`${BE_BASE_URL}user/time/date/list-three-months`)
        dates.value = res.data?.data || []
    } catch (err) {
        console.error(err)
        alert('Gagal memuat tanggal')
    }
}

async function fetchHours() {
    try {
        const res = await axios.get(`${BE_BASE_URL}user/time/hour/list`)
        hours.value = res.data?.data || []
    } catch (err) {
        console.error(err)
        alert('Gagal memuat jam')
    }
}

async function fetchDocuments() {
    try {

        const token = localStorage.getItem('token')
        const deviceId = localStorage.getItem('device_id')
        const ip = await getIpAdresses()

        const studio_uuid = router.currentRoute.value.params.studio_uuid
        const res = await axios({
            method: "POST",
            headers: {
                'authorization': `Bearer ${token}`,
                'x-device-id': deviceId,
                'x-ip-address': ip,
                'x-request-id': uuidv4()
            },
            url: `${BE_BASE_URL}owner/file/images`,
            data: {
                studio_uuid
            }
        })
        // console.log(res.data?.data)
        documents.value = res.data?.data || []
    } catch (err) {
        console.error(err)
        alert('Gagal memuat dokumen')
    }
}

// ---------- LIFECYCLE ----------
onMounted(async () => {
    await Promise.all([fetchEquipment(), fetchDate(), fetchDocuments(), fetchHours()])
})

// ---------- SUBMIT ----------
async function submit() {
    // basic client-side checks
    for (const r of operationalList.value) {
        if (!r.date) return alert('Semua baris operasional harus memiliki tanggal.')
        if (!r.open || !r.close) return alert('Isi jam buka dan tutup semua baris.')
        if (!validTime(r)) return alert('Pastikan jam buka < jam tutup untuk setiap baris.')
    }

    loading.value = true
    try {
        // Map equipments
        const equipmentList = Object.entries(selectedEquipments)
            .filter(([_, qty]) => qty > 0)
            .map(([id, qty]) => ({ equipment_id: Number(id), quantity: qty }))

        // Map operational -> date_id
        const operationalTimes = operationalList.value.map(op => {
            const found = dates.value.find(d => d.date === op.date)
            return {
                date_id: found?.date_id || null,
                open_hour: op.open,
                close_hour: op.close
            }
        })

        const payload = {
            equipments: equipmentList,
            prices: [
                { day_type: 'weekday', price: prices.weekday },
                { day_type: 'weekend', price: prices.weekend }
            ],
            operational_times: operationalTimes,
            document_photo_id: selectedDocumentId.value,
            studio_uuid: router.currentRoute.value.params.studio_uuid
        }

        console.log(payload, "isi payload")

        // await axios.post(`${BE_BASE_URL}owner/studio/create-detail`, payload)
        // alert('Studio berhasil didaftarkan!')
        // optionally reset form here
    } catch (err) {
        console.error(err)
        alert('Gagal menyimpan data studio!')
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
/* kecil saja: kalau mau sembunyikan native picker icon di chrome, uncomment */
/* input[type="time"]::-webkit-calendar-picker-indicator { opacity: 0; } */
</style>
