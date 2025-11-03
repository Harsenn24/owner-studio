<template>
    <MainPage>
        <!-- Tab Navigation -->
        <HomePageTab v-model:activeTab="activeTab" />

        <!-- Content -->

        <!-- DAFTAR STUDIO -->
        <template v-if="activeTab === 'studios'">
            <div class="space-y-3 bg-white rounded-xl">
                <h2 class="text-xl font-bold text-gray-800 mt-2">MAU NGEBAND DIMANA ?</h2>

                <input v-model="searchQuery" type="text" placeholder="Cari nama studio..."
                    class="w-full px-3 py-2 rounded-lg border border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black " />

                <p class="text-sm text-gray-600 text-right font-bold mr-2">
                    Menampilkan {{ filteredStudios.length }} dari {{ totalStudio }} studio
                </p>
            </div>

            <!-- Loading state -->
            <div v-if="loading" class="text-center text-gray-500 py-4">Loading studio...</div>

            <!-- List Studio -->
            <div v-else v-for="studio in filteredStudios" :key="studio.id"
                class="cursor-pointer block bg-white rounded-xl shadow-md overflow-hidden border-2 border-black hover:shadow-lg transition"
                @click="goToStudioDetail(studio.id)">
                <img :src="studio.image_url" alt="venue" class="w-full h-48 object-cover" />

                <div class="p-4 space-y-1 text-left">
                    <h3 class="font-semibold text-gray-900 text-lg truncate">{{ studio.name }}</h3>

                    <div class="text-sm text-gray-600 flex items-center gap-1">
                        <span class="text-yellow-500">★</span>
                        <span>({{ studio.rating || 'No rating' }})</span>
                        <span>•</span>
                        <span>{{ studio.location }}</span>
                    </div>

                    <div class="mt-1">
                        <a :href="studio.maps_url" target="_blank" rel="noopener noreferrer"
                            class="text-blue-600 hover:underline text-sm" @click.stop>
                            📍 Lihat di Google Maps
                        </a>
                    </div>

                    <p class="text-black font-semibold mt-2">
                        Start From <span class="text-primary">Rp {{ formatPrice(studio.price) }},-</span>
                    </p>
                </div>
            </div>
        </template>

        <!-- LIST BOOKING -->
        <template v-else>
            <MyBookingPage :bookings="bookings" />
        </template>
    </MainPage>
</template>

<script>
import HomePageTab from '../HomePageTab/HomePageTab.vue'
import MainPage from '../MainPage/MainPage.vue'
import MyBookingPage from '../MyBookingPage/MyBookingPage.vue'
import { fetchStudios } from './CardStudioListPage.js'
import { fetchMyBookings } from './CardMyBookingListPage.js'

export default {
  components: { HomePageTab, MainPage, MyBookingPage },
  data() {
    return {
      activeTab: 'studios',
      searchQuery: '',
      studios: [],
      bookings: [],
      totalStudio: 0,
      limit: 0,
      loading: false
    }
  },
  computed: {
    filteredStudios() {
      return this.studios.filter((studio) =>
        studio.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    }
  },
  watch: {
    // ✅ setiap kali tab berubah, update URL query tanpa reload
    activeTab(newValue) {
      const currentQuery = this.$route.query.tab
      if (newValue !== currentQuery) {
        this.$router.replace({ query: { tab: newValue } })
      }
    }
  },
  async mounted() {
    // ✅ ambil nilai tab dari URL saat halaman pertama kali dibuka
    const queryTab = this.$route.query.tab
    this.activeTab = queryTab || 'studios'

    this.loading = true
    try {
      const [{ studios, total, limit }, myBooking] = await Promise.all([
        fetchStudios(),
        fetchMyBookings()
      ])
      this.studios = studios
      this.totalStudio = total
      this.limit = limit
      this.bookings = myBooking
    } catch (err) {
      console.error('Gagal mengambil data:', err)
    } finally {
      this.loading = false
    }
  },
  methods: {
    goToStudioDetail(studioId) {
      this.$router.push(`/list-studio/${studioId}`)
    },
    formatPrice(value) {
      if (!value) return '0'
      return new Intl.NumberFormat('id-ID').format(value)
    }
  }
}
</script>

