<template>
    <div
      class=" sticky top-0 z-20 bg-white border border-gray-800  bg-opacity-90 backdrop-blur rounded-xl shadow-md p-2 flex gap-2 w-full max-w-md">
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
      class=" sticky top-[72px] z-20 bg-white py-3 text-xl font-bold text-gray-800 border-b border-gray-300">
      Daftar Booking Saya
    </div>

</template>

<script>
export default {
  props: {
    activeTab: {
      type: String,
      required: true
    }
  },
  emits: ['update:activeTab']
}
</script>
