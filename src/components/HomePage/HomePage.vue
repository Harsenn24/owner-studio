<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-b from-white via-gray-50 to-gray-100 p-6">
    <!-- Header -->
    <header class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-slate-800">StudioSpace Owner</h1>
      <div class="flex justify-between gap-x-4">
        <div v-if="studioList.length > 0">
          <button @click="openModal"
            class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-green-500 text-white font-medium shadow hover:opacity-90 transition-all">
            + Tambah Studio
          </button>
        </div>

        <button @click="logout"
          class="px-5 py-2.5 rounded-xl bg-red-500!  text-white font-medium shadow hover:opacity-90 transition-all">
          LogOut
        </button>

      </div>
    </header>

    <!-- Info Cards + Search -->
    <div v-if="studioList.length > 0"
      class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3 bg-gradient-to-r from-blue-600 to-green-500 rounded-2xl p-4">
      <div class="flex flex-col sm:flex-row items-center gap-4">
        <div class="bg-white shadow-md rounded-2xl px-5 py-3">
          <p class="text-sm text-slate-500">Total Studio</p>
          <p class="text-xl font-bold text-blue-600">{{ totalData }}</p>
        </div>
        <div class="bg-white shadow-md rounded-2xl px-5 py-3">
          <p class="text-sm text-slate-500">Transaksi Hari Ini</p>
          <p class="text-xl font-bold text-green-600">0</p> <!-- Dummy value -->
        </div>
      </div>
      <div class="flex gap-2 w-full sm:w-1/3 mt-2 sm:mt-0">
        <input v-model="searchQuery" @keyup.enter="fetchStudios(1)" placeholder="Cari nama studio..." type="text"
          class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-black" />
        <button @click="fetchStudios(1)"
          class="px-3 py-2 bg-white! text-black rounded-lg hover:bg-blue-700 transition">Cari</button>
      </div>
    </div>

    <!-- Studio Grid -->
    <div class="flex-1 bg-gradient-to-r from-blue-600 to-green-500 py-6 px-6 ">
      <div v-if="studioList.length > 0" class="grid justify-center grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        <div v-for="studio in studioList" :key="studio.studio_id"
          class="bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden">

          <!-- Header Card -->
          <div class="p-5">
            <h3 class="text-lg font-semibold text-slate-800">{{ studio.studio_name }}</h3>
            <p class="text-sm text-slate-500">ID: {{ studio.studio_id }}</p>
          </div>

          <!-- Body -->
          <div class="px-5 pb-5 border-t border-slate-100">
            <p class="text-sm text-slate-600 mb-1">📍 {{ studio.studio_city }}, {{ studio.studio_district }}</p>
            <p class="text-xs text-slate-400">Dibuat: {{ formatDate(studio.studio_created_at * 1000) }}</p>
          </div>

          <div class="px-5 pb-5 border-t border-slate-100">
            <p class="text-xl text-black"> -Rp 20.000</p>
          </div>

          <!-- Footer -->
          <div class="px-5 py-3 bg-slate-50 flex justify-between items-center border-t border-slate-100">
            <a :href="studio.studio_gmaps" target="_blank"
              class="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center gap-1">
              🌐 Lihat di Maps
            </a>
            <button class="text-sm bg-white! text-slate-500 hover:text-slate-700 transition-colors"
              @click="openEditModal(studio)">✏️ Edit</button>
          </div>
        </div>
      </div>

      <!-- 🚫 CASE 2: Owner belum punya studio -->
      <div v-else class="flex flex-col lg:flex-row items-center justify-center gap-10 py-20 bg-white">
        <section class="flex flex-col justify-center px-8 max-w-lg">
          <h2 class="text-4xl lg:text-5xl font-extrabold text-slate-800 leading-tight">
            Kamu belum punya
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">studio</span>
          </h2>
          <p class="mt-4 text-slate-500 text-base">
            Buat listing studiomu agar pengguna bisa menemukan dan menyewa ruangmu.
          </p>
          <div class="mt-8 flex flex-wrap items-center gap-5">
            <button @click="openModal"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold shadow-md hover:scale-[1.02] transition-transform">
              + Buat Studiomu
            </button>
          </div>
        </section>
      </div>
    </div>

    <!-- Pagination Fixed Bottom -->
    <div v-if="studioList.length > 0"
      class="mt-6 py-6 px-6 bg-white shadow-inner flex justify-center items-center gap-2 sticky bottom-0 z-10">
      <button @click="changePage(page - 1)" :disabled="page === 1"
        class="px-3 py-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-50">
        Prev
      </button>
      <button v-for="p in maxPage" :key="p" @click="changePage(p)"
        :class="['px-3 py-1 rounded-lg border', page === p ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-300 hover:bg-slate-100']">
        {{ p }}
      </button>
      <button @click="changePage(page + 1)" :disabled="page === maxPage"
        class="px-3 py-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-50">
        Next
      </button>
    </div>

    <!-- Modal Form -->
    <transition name="modal-fade">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeModal"></div>
        <div class="relative bg-white rounded-2xl w-full max-w-2xl p-6 z-50 drop-shadow-2xl border border-white/30">
          <header class="flex items-start justify-between gap-4 mb-4">
            <h3 class="text-lg font-semibold text-black">Form Pengajuan Studio</h3>
            <button @click="closeModal" class="text-slate-400 hover:text-slate-600">✖️</button>
          </header>

          <form @submit.prevent="submitForm">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Nama Studio -->
              <div>
                <label class="text-xs font-medium text-slate-600">Nama Studio</label>
                <input v-model="form.name" required
                  class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-black text-black"
                  placeholder="Contoh: Studio Suara Jakarta" />
              </div>
              <!-- Provinsi -->
              <div class="relative">
                <label class="text-xs font-medium text-slate-600">Provinsi</label>
                <input type="text" v-model="provinceSearch" @input="fetchProvinces" @focus="fetchProvinces" placeholder="Cari provinsi..."
                  class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-black text-black!" />
                <ul v-if="provinceList.length"
                  class="absolute w-full max-h-48 overflow-auto border rounded mt-1 bg-white z-50 text-black! py-2">
                  <li v-for="province in provinceList" :key="province.id" @click="selectProvince(province)"
                    class="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                    {{ province.name }}
                  </li>
                </ul>
              </div>
              <!-- Kota -->
              <div>
                <label class="text-xs font-medium text-slate-600">Kota</label>
                <input v-model="form.city" required
                  class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-black text-black"
                  placeholder="Contoh: Bekasi" />
              </div>
              <!-- Kecamatan -->
              <div>
                <label class="text-xs font-medium text-slate-600">Kecamatan</label>
                <input v-model="form.district" required
                  class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-black text-black"
                  placeholder="Contoh: Rawalumbu" />
              </div>
              <!-- Kelurahan -->
              <div>
                <label class="text-xs font-medium text-slate-600">Kelurahan</label>
                <input v-model="form.subDistrict" required
                  class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-black text-black"
                  placeholder="Contoh: Bojong Rawalumbu" />
              </div>
              <!-- Kode Pos -->
              <div>
                <label class="text-xs font-medium text-slate-600">Kode Pos</label>
                <input v-model="form.postalCode" required
                  class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-black text-black"
                  placeholder="Contoh: 554488" />
              </div>
              <!-- Google Maps -->
              <div>
                <label class="text-xs font-medium text-slate-600">Tautan Google Maps</label>
                <input v-model="form.gmaps"
                  class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-black text-black"
                  placeholder="https://maps.app.goo.gl/..." />
              </div>
            </div>

            <!-- Alamat Lengkap -->
            <div>
              <label class="text-xs font-medium text-slate-600">Alamat Lengkap</label>
              <input v-model="form.address"
                class="mt-2 w-full rounded-lg border px-3 py-5 text-sm border-black text-black"
                placeholder="Jalan Sukmajaya 1 NO ...." />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Contact Person Name -->
              <div>
                <label class="text-xs font-medium text-slate-600">Contact Person Name</label>
                <input v-model="form.contactName" required
                  class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-black text-black"
                  placeholder="Contoh: Dhimas" />
              </div>
              <!-- Contact Person Phone -->
              <div>
                <label class="text-xs font-medium text-slate-600">Contact Person Phone</label>
                <input v-model="form.contactPhone" required
                  class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-black text-black"
                  placeholder="Contoh: 08135115415" />
              </div>
              <!-- Bank -->
              <div>
                <label class="text-xs font-medium text-slate-600">Bank</label>
                <input v-model="form.bank" required
                  class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-black text-black"
                  placeholder="Contoh: BCA" />
              </div>
              <!-- Nomor Rekening Bank -->
              <div>
                <label class="text-xs font-medium text-slate-600">Nomor Rekening Bank</label>
                <input v-model="form.bankAccount" required
                  class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-black text-black"
                  placeholder="Contoh: 5544512536" />
              </div>
            </div>

            <!-- Upload Images -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label class="text-xs font-medium text-slate-600">Upload KTP</label>
                <input type="file" accept="image/*" @change="handleFileUpload($event, 'ktp')"
                  class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-black text-black" />
              </div>
              <div>
                <label class="text-xs font-medium text-slate-600">Upload Foto Studio 1</label>
                <input type="file" accept="image/*" @change="handleFileUpload($event, 'studio1')"
                  class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-black text-black" />
              </div>
              <div>
                <label class="text-xs font-medium text-slate-600">Upload Foto Studio 2</label>
                <input type="file" accept="image/*" @change="handleFileUpload($event, 'studio2')"
                  class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-black text-black" />
              </div>
            </div>

            <!-- Buttons -->
            <div class="md:col-span-2 flex justify-end gap-3 mt-4">
              <button type="button" @click="closeModal"
                class="px-4 py-2 rounded-lg border border-slate-200">Batal</button>
              <button type="submit"
                class="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white">Kirim
                Pengajuan</button>
            </div>
          </form>

        </div>
      </div>
    </transition>
  </div>
</template>


<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { getIpAdresses } from '../../services/axios/ip-adress.services.js'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'vue-router'

const router = useRouter()
const studioList = ref([])
const provinceList = ref([])
const page = ref(1)
const limit = 6
const maxPage = ref(1)
const totalData = ref(0)
const searchQuery = ref('')
const provinceSearch = ref('') // 👈 input provinsi pakai ini
const showModal = ref(false)

const form = reactive({
  name: '',
  city: '',
  district: '',
  gmaps: '',
  province: '' // 👈 tambahkan ini agar data provinsi tersimpan
})

function logout() {
  localStorage.clear()
  router.push('/login')
}

function openModal() { showModal.value = true }
function closeModal() { showModal.value = false }

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

async function fetchStudios(p = page.value) {
  page.value = p
  try {
    const BE_BASE_URL = import.meta.env.VITE_STUDIO_BAND_BE_BASE_URL
    const token = localStorage.getItem('token')
    const deviceId = localStorage.getItem('device_id')
    const ip = await getIpAdresses()
    const response = await axios({
      method: 'POST',
      url: `${BE_BASE_URL}owner/studio/list`,
      headers: {
        'authorization': `Bearer ${token}`,
        'x-device-id': deviceId,
        'x-ip-address': ip,
        'x-request-id': uuidv4()
      },
      data: {
        page: page.value,
        limit,
        search: searchQuery.value
      }
    })
    if (response.data.status) {
      studioList.value = response.data.data.data || []
      maxPage.value = response.data.data.maxPage
      totalData.value = response.data.data.totalData
    }
  } catch (err) {
    console.error(err)
    alert('Gagal memuat data studio. Silakan coba lagi.')
  }
}

async function fetchProvinces() {
  try {
    const BE_BASE_URL = import.meta.env.VITE_STUDIO_BAND_BE_BASE_URL
    const response = await axios({
      method: 'POST',
      url: `${BE_BASE_URL}owner/address/province-pagination`,
      data: {
        page: 1,
        limit: 10,
        search: provinceSearch.value // 👈 ubah pakai provinceSearch
      }
    })

    if (response.data.status) {
      provinceList.value = response.data.data.data
    }
  } catch (error) {
    console.error(error)
    alert('Gagal memuat data provinsi. Silakan coba lagi.')
  }
}

function selectProvince(province) {
  console.log('Pilih provinsi:', province)
  form.province = province.id       // simpan ke form utama
  provinceSearch.value = province.name // tampilkan di input
  provinceList.value = []              // tutup dropdown
}

function changePage(p) {
  if (p < 1 || p > maxPage.value) return
  fetchStudios(p)
}

function submitForm() {
  console.log('Submit studio:', form)
  closeModal()
}

onMounted(() => {
  fetchStudios()
})
</script>


<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 200ms ease, transform 200ms ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: translateY(6px) scale(0.995);
}
</style>
