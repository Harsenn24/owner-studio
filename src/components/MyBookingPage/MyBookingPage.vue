<template>
  <div class="space-y-4">

    <div v-if="!bookings.length" class="text-gray-500 text-center py-4">
      <img :src="`${BE_BASE_URL}uploads/belum-booking.png`" alt="Belum ada booking" class="mx-auto mb-4 w-500 h-auto" />
      <hr class="border-t-2 border-gray-400 w-3/4 mx-auto my-4" />
      <button @click="reloadPage"
        class="bg-blue-500! text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600! transition">
        Booking Sekarang
      </button>
    </div>

    <div v-else class="bg-white py-2 px-2">
      <div v-for="booking in bookings" :key="booking.id"
        class="relative bg-white p-4 rounded-lg shadow border border-gray-800! mb-7">

        <!-- Badge status di kanan atas -->
        <span class="absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded" :class="{
          'bg-blue-800 text-white': booking.status === 'booked',
          'bg-green-800 text-white': booking.status === 'pending',
          'bg-red-800 text-white': booking.status === 'cancelled'
        }">
          {{ booking.status }}
        </span>

        <!-- List Detail Booking -->
        <div class=" cursor-pointer space-y-2" @click="goToTransactionDetail(booking.booking_id)">
          <div v-for="(detail, index) in booking.bookDetail" :key="index" class=" p-2 rounded-lg border text-sm mt-6">
            <!-- Nomor Studio -->
            <div class="text-gray-700 font-medium">
              {{ booking.studio_name.toUpperCase() }} | {{ formatDate(detail.date) }}
            </div>
            <div class="text-gray-700 font-medium">
              {{ detail.start_time }} - {{ detail.end_time }}
            </div>
          </div>
        </div>

        <!-- Payment link (opsional) -->
        <div v-if="booking.payment_link" class="mt-2 text-center">
          <button @click="goToPayment(booking.booking_id)"
            class="inline-block bg-green-800! text-white! px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
            Bayar Sekarang
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchMyBookings } from '../CardStudioListPage/CardMyBookingListPage';

export default {
  name: "MyBookingPage",
  props: {
    bookings: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    },
    reloadPage() {
      this.$router.push({ path: '/list-studio', query: { tab: 'studios' } })
        .then(() => {
          window.location.reload(); // reload setelah routing selesai
        });
    },
    goToPayment(bookingId) {
      this.$router.push({
        path: '/order/payment',
        query: { transactionId: bookingId }
      });
    },
    goToTransactionDetail(booking_id) {
      this.$router.push({
        path: `/booking/${booking_id}`
      });
    }
  },
  data() {
    return {
      BE_BASE_URL: import.meta.env.VITE_STUDIO_BAND_BE_BASE_URL
    }
  },
  async mounted() {
    await fetchMyBookings()
  }
}
</script>
