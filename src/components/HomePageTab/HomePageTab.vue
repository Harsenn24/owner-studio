<template>
  <div
    class="sticky top-0 z-20 bg-white border border-gray-800 bg-opacity-90 backdrop-blur rounded-xl shadow-md p-2 flex gap-2 w-full max-w-md">
    <button @click="$emit('update:activeTab', 'studios')" :class="['flex-1 py-2 rounded-lg font-bold text-lg',
      activeTab === 'studios'
        ? 'bg-blue-200! text-black'
        : 'bg-blue-500! text-black']">
      🎵 Studio
    </button>
    <button @click="$emit('update:activeTab', 'bookings')" :class="['flex-1 py-2 rounded-lg font-bold text-lg',
      activeTab === 'bookings'
        ? 'bg-blue-200! text-black'
        : 'bg-blue-500! text-black']">
      📅 Booking Saya
    </button>
  </div>

  <div v-if="activeTab === 'bookings'"
    class="sticky top-[72px] z-20 bg-white py-3 text-xl font-bold text-gray-800 border-b border-gray-300">
    Daftar Booking Saya
  </div>

  <!-- ✅ Tambahan baru: tampilkan daftar studio milik owner -->
  <div v-if="activeTab === 'studios'" class="mt-4 px-2">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold text-gray-800">Daftar Studio Saya</h2>
      <button @click="goToCreateStudio"
        class="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-600">
        + Tambah Studio
      </button>
    </div>

    <div v-if="isLoading" class="text-center py-8 text-gray-500">
      Memuat data studio...
    </div>

    <div v-else-if="studioList.length === 0" class="text-center text-gray-500 py-8">
      Belum ada studio terdaftar.<br />
      <button @click="goToCreateStudio" class="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
        + Buat Studio Pertama
      </button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="studio in studioList" :key="studio.studio_id"
        class="bg-white border border-gray-200 rounded-xl shadow-md p-4">
        <h3 class="font-semibold text-lg">{{ studio.studio_name }}</h3>
        <p class="text-sm text-gray-500">{{ studio.studio_district }}, {{ studio.studio_city }}</p>
        <!-- <p class="text-sm mt-2">Weekday: Rp{{ formatPrice(studio.studio_price_weekday) }}</p>
        <p class="text-sm">Weekend: Rp{{ formatPrice(studio.studio_price_weekend) }}</p> -->
        <p class="text-xs text-gray-400 mt-2">Dibuat: {{ formatDate(studio.created_at) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { getIpAdresses } from '../../services/axios/ip-adress.services.js'

export default {
  props: {
    activeTab: {
      type: String,
      required: true
    }
  },
  emits: ['update:activeTab'],
  data() {
    return {
      isLoading: true,
      studioList: []
    }
  },
  methods: {
    async getStudioList() {
      try {
        this.isLoading = true
        const BE_BASE_URL = import.meta.env.VITE_STUDIO_BAND_BE_BASE_URL
        const token = localStorage.getItem('token')
        const deviceId = localStorage.getItem('device_id')
        const ip = await getIpAdresses()

        const response = await axios.get(`${BE_BASE_URL}owner/studio/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-device-id': deviceId,
            'x-ip-address': ip,
            'x-request-id': uuidv4()
          }
        })

        console.log(response)

        this.studioList = response.data.data || []
      } catch (error) {
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },
    formatPrice(num) {
      return new Intl.NumberFormat('id-ID').format(num)
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    },
    goToCreateStudio() {
      this.$router.push('/create-studio')
    }
  },
  watch: {
    activeTab(newVal) {
      if (newVal === 'studios') this.getStudioList()
    }
  }
}
</script>
