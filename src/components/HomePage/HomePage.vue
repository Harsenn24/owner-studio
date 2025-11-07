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
                <input v-model="form.name" @input="handleNameInput" required minlength="5" maxlength="20"
                  class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-black text-black"
                  placeholder="Contoh: Studio Suara Jakarta" />
                <p v-if="form.name.length > 0 && (form.name.length < 5 || form.name.length > 20)"
                  class="text-xs text-red-500 mt-1">
                  Nama studio harus antara 5–20 karakter.
                </p>
              </div>

              <!-- Provinsi -->
              <div class="relative" ref="provinceContainer">
                <label class="text-xs font-medium text-slate-600">Provinsi</label>
                <input type="text" v-model="provinceSearch" @input="fetchProvinces" @focus="fetchProvinces"
                  placeholder="Cari provinsi..."
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
              <div class="relative" ref="cityContainer">
                <label class="text-xs font-medium text-slate-600">Kota</label>
                <input type="text" v-model="citySearch" @input="fetchCities()" @focus="fetchCities()"
                  placeholder="Cari kota..."
                  class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-black text-black!" />
                <ul v-if="cityList.length"
                  class="absolute w-full max-h-48 overflow-auto border rounded mt-1 bg-white z-50 text-black! py-2">
                  <li v-for="city in cityList" :key="city.id" @click="selectCities(city)"
                    class="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                    {{ city.name }}
                  </li>
                </ul>
              </div>
              <!-- Kecamatan -->
              <div class="relative" ref="districtContainer">
                <label class="text-xs font-medium text-slate-600">Kecamatan</label>
                <input type="text" v-model="districtSearch" @input="fetchDistricts()" @focus="fetchDistricts()"
                  placeholder="Cari kecamatan..."
                  class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-black text-black!" />
                <ul v-if="districtList.length"
                  class="absolute w-full max-h-48 overflow-auto border rounded mt-1 bg-white z-50 text-black! py-2">
                  <li v-for="district in districtList" :key="district.id" @click="selectDistrict(district)"
                    class="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                    {{ district.name }}
                  </li>
                </ul>
              </div>
              <!-- Kelurahan -->
              <div class="relative" ref="villageContainer">
                <label class="text-xs font-medium text-slate-600">Kelurahan</label>
                <input type="text" v-model="villageSearch" @input="fetchVillages()" @focus="fetchVillages()"
                  placeholder="Cari kelurahan..."
                  class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-black text-black!" />
                <ul v-if="villageList.length"
                  class="absolute w-full max-h-48 overflow-auto border rounded mt-1 bg-white z-50 text-black! py-2">
                  <li v-for="village in villageList" :key="village.id" @click="selectVillage(village)"
                    class="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                    {{ village.name }}
                  </li>
                </ul>
              </div>
              <!-- Kode Pos -->
              <div class="relative" ref="postalCodeContainer">
                <label class="text-xs font-medium text-slate-600">Kode Pos</label>
                <input type="text" v-model="postalCodeSearch" @input="fetchPostalCode()" @focus="fetchPostalCode()"
                  placeholder="Cari kode pos..."
                  class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-black text-black!" />
                <ul v-if="postalCodeList.length"
                  class="absolute w-full max-h-48 overflow-auto border rounded mt-1 bg-white z-50 text-black! py-2">
                  <li v-for="postal_code in postalCodeList" :key="postal_code.id" @click="selectPostalCode(postal_code)"
                    class="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                    {{ postal_code.postal_code }}
                  </li>
                </ul>
              </div>
              <!-- Google Maps -->
              <div>
                <label class="text-xs font-medium text-slate-600">Tautan Google Maps</label>
                <input v-model="form.gmaps" @input="handleGmapsInput" required
                  class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-black text-black"
                  placeholder="https://maps.app.goo.gl/..." />
                <p v-if="form.gmaps && form.gmaps.length < 5" class="text-xs text-red-500 mt-1">
                  Tautan minimal 5 karakter.
                </p>
                <p v-else-if="form.gmaps && !isValidUrl(form.gmaps)" class="text-xs text-red-500 mt-1">
                  Harus berupa tautan (URL) yang valid.
                </p>
              </div>

            </div>

            <!-- Alamat Lengkap -->
            <div>
              <label class="text-xs font-medium text-slate-600">Alamat Lengkap</label>
              <textarea v-model="form.address" @input="handleAddressInput" required rows="3"
                class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-black text-black resize-none overflow-hidden"
                placeholder="Contoh: Jalan Sukmajaya 1 No. 23, Depok"></textarea>

              <p v-if="form.address && form.address.length < 10" class="text-xs text-red-500 mt-1">
                Alamat minimal 10 karakter.
              </p>
            </div>


            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Contact Person Name -->
              <div>
                <label class="text-xs font-medium text-slate-600">Contact Person Name</label>
                <input v-model="form.contactName" @input="handleContactNameInput" required minlength="5" maxlength="20"
                  class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-black text-black"
                  placeholder="Contoh: Dhimas" />
                <p v-if="form.contactName.length > 0 && (form.contactName.length < 5 || form.contactName.length > 20)"
                  class="text-xs text-red-500 mt-1">
                  Nama contact person harus antara 5–20 karakter.
                </p>
              </div>
              <!-- Contact Person Phone -->
              <div>
                <label class="text-xs font-medium text-slate-600">Contact Person Phone</label>
                <input v-model="form.contactPhone" @input="handlePhoneInput" required maxlength="15"
                  class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-black text-black"
                  placeholder="Contoh: 08135115415" />

                <p v-if="phoneError" class="text-xs text-red-500 mt-1">
                  {{ phoneError }}
                </p>
              </div>

              <!-- Bank -->
              <div class="relative" ref="provinceContainer">
                <label class="text-xs font-medium text-slate-600">Bank</label>
                <input type="text" v-model="bankSearch" @input="fetchBank" @focus="fetchBank" placeholder="nama bank..."
                  class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-black text-black!" />
                <ul v-if="bankList.length"
                  class="absolute w-full max-h-48 overflow-auto border rounded mt-1 bg-white z-50 text-black! py-2">
                  <li v-for="bank in bankList" :key="bank.id" @click="selectBank(bank)"
                    class="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                    {{ bank.name }}
                  </li>
                </ul>
              </div>
              <!-- Nomor Rekening Bank -->
              <div>
                <label class="text-xs font-medium text-slate-600">Nomor Rekening Bank</label>
                <input v-model="form.bankAccount" @input="handleBankAccountInput" required minlength="5" maxlength="20"
                  class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-black text-black"
                  placeholder="Contoh: 5544512536" />
                <p v-if="form.bankAccount && form.bankAccount.length < 5" class="text-xs text-red-500 mt-1">
                  Nomor Rekening minimal 5 karakter.
                </p>
              </div>

            </div>

            <!-- Upload Images -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <!-- Upload KTP -->
              <div>
                <label class="text-sm font-medium text-slate-700">Upload KTP</label>

                <input v-if="!previewFile.ktp" type="file" accept="image/*" required
                  @change="handleFileUpload($event, 'ktp')"
                  class="mt-2 w-full rounded-lg border px-3 py-3 text-sm border-black text-black cursor-pointer" />

                <div v-else class="mt-3 relative rounded-lg overflow-hidden border border-gray-300 shadow-md">
                  <img :src="previewFile.ktp" alt="Preview KTP" class="w-full aspect-[16/9] object-cover" />
                  <button @click="removeFile('ktp')"
                    class="absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-opacity-100 text-xs font-medium px-2 py-1 rounded shadow">
                    Ganti Foto
                  </button>
                </div>

                <p v-if="errorsFile.ktp" class="text-xs text-red-500 mt-1">{{ errorsFile.ktp }}</p>
              </div>

              <!-- Upload Studio 1 -->
              <div>
                <label class="text-sm font-medium text-slate-700">Upload Foto Studio 1</label>

                <input v-if="!previewFile.studio1" type="file" accept="image/*" required
                  @change="handleFileUpload($event, 'studio1')"
                  class="mt-2 w-full rounded-lg border px-3 py-3 text-sm border-black text-black cursor-pointer" />

                <div v-else class="mt-3 relative rounded-lg overflow-hidden border border-gray-300 shadow-md">
                  <img :src="previewFile.studio1" alt="Preview Studio 1" class="w-full aspect-[16/9] object-cover" />
                  <button @click="removeFile('studio1')"
                    class="absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-opacity-100 text-xs font-medium px-2 py-1 rounded shadow">
                    Ganti Foto
                  </button>
                </div>

                <p v-if="errorsFile.studio1" class="text-xs text-red-500 mt-1">{{ errorsFile.studio1 }}</p>
              </div>

              <!-- Upload Studio 2 -->
              <div>
                <label class="text-sm font-medium text-slate-700">Upload Foto Studio 2</label>

                <input v-if="!previewFile.studio2" type="file" accept="image/*" required
                  @change="handleFileUpload($event, 'studio2')"
                  class="mt-2 w-full rounded-lg border px-3 py-3 text-sm border-black text-black cursor-pointer" />

                <div v-else class="mt-3 relative rounded-lg overflow-hidden border border-gray-300 shadow-md">
                  <img :src="previewFile.studio2" alt="Preview Studio 2" class="w-full aspect-[16/9] object-cover" />
                  <button @click="removeFile('studio2')"
                    class="absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-opacity-100 text-xs font-medium px-2 py-1 rounded shadow">
                    Ganti Foto
                  </button>
                </div>

                <p v-if="errorsFile.studio2" class="text-xs text-red-500 mt-1">{{ errorsFile.studio2 }}</p>
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
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import axios from 'axios'
import { getIpAdresses } from '../../services/axios/ip-adress.services.js'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'vue-router'

const checkSubmissionStatus = ref('')
const checkSubmissionStudioName = ref('')
const checkSubmissionCreatedAt = ref(0)
const isSubmitted = ref(false)

const router = useRouter()
const studioList = ref([])
const page = ref(1)
const limit = 6
const maxPage = ref(1)
const totalData = ref(0)
const searchQuery = ref('')
const showModal = ref(false)

const provinceSearch = ref('')
const provinceList = ref([])
const provinceContainer = ref(null)

const citySearch = ref('')
const cityList = ref([])
const cityContainer = ref(null)

const districtSearch = ref('')
const districtList = ref([])
const districtContainer = ref(null)

const villageSearch = ref('')
const villageList = ref([])
const villageContainer = ref(null)

const postalCodeSearch = ref('')
const postalCodeList = ref([])
const postalCodeContainer = ref(null)

const bankSearch = ref('')
const bankList = ref([])

const phoneError = ref('')

const previewFile = ref({ ktp: null, studio1: null, studio2: null })
const errorsFile = ref({ ktp: '', studio1: '', studio2: '' })

const form = reactive({
  name: '',
  city: '',
  district: '',
  gmaps: '',
  province: '',
  postalCode: '',
  bank: '',
  bankAccount: '',
  contactName: '',
  contactPhone: '',
  document_ids: []
})

function removeFile(type) {
  previewFile.value[type] = null
  errorsFile.value[type] = ''
}

async function handleFileUpload(event, type) {
  const file = event.target.files[0]
  if (!file) return

  errorsFile.value[type] = ''

  // Validasi ukuran file (maksimal 500 KB)
  if (file.size > 500 * 1024) {
    errorsFile.value[type] = 'Ukuran file maksimal 500 KB.'
    return
  }

  // Preview langsung (tanpa validasi rasio)
  const fileUrl = URL.createObjectURL(file)
  previewFile.value[type] = fileUrl

  // Tentukan module name
  const moduleName = type === 'ktp' ? 'studio.ktp' : 'studio.photo'

  try {
    const BE_BASE_URL = import.meta.env.VITE_STUDIO_BAND_BE_BASE_URL
    const token = localStorage.getItem('token')
    const deviceId = localStorage.getItem('device_id')
    const ip = await getIpAdresses()

    const formData = new FormData()
    formData.append('image', file)
    formData.append('module', moduleName)

    const response = await axios.post(`${BE_BASE_URL}owner/file/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'authorization': `Bearer ${token}`,
        'x-device-id': deviceId,
        'x-ip-address': ip,
        'x-request-id': uuidv4()
      }
    })

    if (!response.data.status) {
      errorsFile.value[type] = 'Upload gagal. Silakan coba lagi.'
    } else {
      console.log(`✅ ${type} berhasil diupload:`, response.data.data)
      form.document_ids.push(response.data.data.file_id)
    }
  } catch (err) {
    console.error(err)
    errorsFile.value[type] = 'Terjadi kesalahan saat upload.'
  }
}

function handleNameInput(e) {
  let value = e.target.value

  value = value
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase())

  form.name = value
}

function handleContactNameInput(e) {
  let value = e.target.value

  value = value
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase())

  form.contactName = value
}

function handleGmapsInput() {
  form.gmaps = form.gmaps.trim()
}

function isValidUrl(value) {
  try {
    new URL(value)
    return true
  } catch (_) {
    return false
  }
}

function handleBankAccountInput() {
  form.bankAccount = form.bankAccount.replace(/\D/g, '')
}


function handlePhoneInput() {
  const value = form.contactPhone

  form.contactPhone = value.replace(/\D/g, '')

  if (!form.contactPhone.startsWith('08')) {
    phoneError.value = 'Nomor harus diawali dengan 08.'
  } else if (form.contactPhone.length < 10) {
    phoneError.value = 'Nomor minimal 10 digit.'
  } else if (form.contactPhone.length > 15) {
    phoneError.value = 'Nomor maksimal 15 digit.'
  } else {
    phoneError.value = ''
  }
}

function handleAddressInput(e) {
  const textarea = e.target

  textarea.style.height = 'auto'
  textarea.style.height = textarea.scrollHeight + 'px'

  if (form.address && form.address.length < 10) {
    console.warn('Alamat terlalu pendek')
  }
}



function logout() {
  localStorage.clear()
  router.push('/login')
}

function openModal() { showModal.value = true }
function closeModal() {
  showModal.value = false
}

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
      if (studioList.value.length > 0) {
        isSubmitted.value = true
      }
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
        limit: 10000,
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
  form.province = province.id
  provinceSearch.value = province.name
  fetchCities(province.id)
  fetchPostalCode(province.id)
  provinceList.value = []
}

async function fetchCities(province_id = form.province) {
  try {
    if (!province_id) return
    const BE_BASE_URL = import.meta.env.VITE_STUDIO_BAND_BE_BASE_URL
    const response = await axios({
      method: 'POST',
      url: `${BE_BASE_URL}owner/address/city-pagination`,
      data: {
        page: 1,
        limit: 10000,
        search: citySearch.value,
        province_id
      }
    })

    if (response.data.status) {
      cityList.value = response.data.data.data
    }
  } catch (error) {
    console.error(error)
    alert('Gagal memuat data kota. Silakan coba lagi.')
  }
}

function selectCities(city) {
  form.city = city.id
  citySearch.value = city.name
  fetchDistricts(city.id)
  fetchPostalCode(city.id)
  cityList.value = []
}

async function fetchDistricts(city_id = form.city) {
  try {
    if (!city_id) return
    const BE_BASE_URL = import.meta.env.VITE_STUDIO_BAND_BE_BASE_URL
    const response = await axios({
      method: 'POST',
      url: `${BE_BASE_URL}owner/address/district-pagination`,
      data: {
        page: 1,
        limit: 10000,
        search: districtSearch.value,
        city_id
      }
    })

    if (response.data.status) {
      districtList.value = response.data.data.data
    }
  } catch (error) {
    console.error(error)
    alert('Gagal memuat data kecamatan. Silakan coba lagi.')
  }
}

function selectDistrict(district) {
  form.district = district.id
  districtSearch.value = district.name
  fetchVillages(district.id)
  fetchPostalCode(district.id)
  districtList.value = []
}

//buat fungsi untuk fetch village
async function fetchVillages(district_id = form.district) {
  try {
    if (!district_id) return
    const BE_BASE_URL = import.meta.env.VITE_STUDIO_BAND_BE_BASE_URL
    const response = await axios({
      method: 'POST',
      url: `${BE_BASE_URL}owner/address/village-pagination`,
      data: {
        page: 1,
        limit: 10000,
        search: villageSearch.value,
        district_id
      }
    })

    if (response.data.status) {
      villageList.value = response.data.data.data
    }
  } catch (error) {
    console.error(error)
    alert('Gagal memuat data kelurahan. Silakan coba lagi.')
  }
}

function selectVillage(village) {
  form.village = village.id
  villageSearch.value = village.name
  fetchPostalCode(village.id)
  villageList.value = []
}

async function fetchPostalCode(province_id = form.province, city_id = form.city, district_id = form.district, village_id = form.village) {
  try {
    if (!province_id || !city_id || !district_id || !village_id) return

    const BE_BASE_URL = import.meta.env.VITE_STUDIO_BAND_BE_BASE_URL
    const response = await axios({
      method: 'POST',
      url: `${BE_BASE_URL}owner/address/postal-code-pagination`,
      data: {
        page: 1,
        limit: 10000,
        search: postalCodeSearch.value,
        province_id,
        city_id,
        district_id,
        village_id
      }
    })

    if (response.data.status) {
      postalCodeList.value = response.data.data.data
    }
  } catch (error) {
    console.error(error)
    alert('Gagal memuat data kode pos. Silakan coba lagi.')
  }
}

function selectPostalCode(postalCode) {
  form.postalCode = postalCode.id
  postalCodeSearch.value = postalCode.postal_code
  postalCodeList.value = []
}


async function fetchBank() {
  try {
    const BE_BASE_URL = import.meta.env.VITE_STUDIO_BAND_BE_BASE_URL
    const response = await axios({
      method: 'POST',
      url: `${BE_BASE_URL}owner/funding/bank-list`,
      data: {
        page: 1,
        limit: 10000,
        search: bankSearch.value
      }
    })

    if (response.data.status) {
      bankList.value = response.data.data.data
    }
  } catch (error) {
    console.error(error)
    alert('Gagal memuat data bank. Silakan coba lagi.')
  }
}

function selectBank(bank) {
  form.bank = bank.prima_code
  bankSearch.value = bank.name
  bankList.value = []
}

function changePage(p) {
  if (p < 1 || p > maxPage.value) return
  fetchStudios(p)
}

async function checkSubmission() {
  const BE_BASE_URL = import.meta.env.VITE_STUDIO_BAND_BE_BASE_URL
  const token = localStorage.getItem('token')
  const deviceId = localStorage.getItem('device_id')
  const ip = await getIpAdresses()
  const response = await axios({
    method: 'POST',
    url: `${BE_BASE_URL}owner/studio/submission/check`,
    headers: {
      'authorization': `Bearer ${token}`,
      'x-device-id': deviceId,
      'x-ip-address': ip,
      'x-request-id': uuidv4()
    },
    data: {}
  })

  if (response.data.status) {
    checkSubmissionStatus.value = response.data.data.status
    checkSubmissionStudioName.value = response.data.data.studio_name
    checkSubmissionCreatedAt.value = response.data.data.created_at
    isSubmitted.value = true
    closeModal()
  }
}

async function submitForm() {
  try {
    const payload = {
      name: form.name,
      address_data: {
        province_id: form.province,
        city_id: form.city,
        district_id: form.district,
        village_id: form.village,
        postal_code_id: form.postalCode,
        address: form.address,
        gmaps: form.gmaps
      },
      contact_person_data: {
        name: form.contactPersonName,
        phone: form.contactPhone,
      },
      account_number_data: {
        bank_code: form.bank,
        bank_account_number: form.bankAccountNumber
      },
      document_ids: form.document_ids
    }

    const BE_BASE_URL = import.meta.env.VITE_STUDIO_BAND_BE_BASE_URL
    const token = localStorage.getItem('token')
    const deviceId = localStorage.getItem('device_id')
    const ip = await getIpAdresses()
    const response = await axios({
      method: 'POST',
      url: `${BE_BASE_URL}owner/studio/submission`,
      headers: {
        'authorization': `Bearer ${token}`,
        'x-device-id': deviceId,
        'x-ip-address': ip,
        'x-request-id': uuidv4()
      },
      data: payload
    })

    if (response.data.status) {
      closeModal()
    }

  } catch (error) {
    console.error(error)
    alert('Gagal membuat studio. Silakan coba lagi.')
  }
}

onMounted(() => {
  fetchStudios()
  checkSubmission()
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

function handleClickOutside(event) {
  if (provinceContainer.value && !provinceContainer.value.contains(event.target)) {
    provinceList.value = []
  }

  if (cityContainer.value && !cityContainer.value.contains(event.target)) {
    cityList.value = []
  }

  if (districtContainer.value && !districtContainer.value.contains(event.target)) {
    districtList.value = []
  }

  if (villageContainer.value && !villageContainer.value.contains(event.target)) {
    villageList.value = []
  }
}
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
