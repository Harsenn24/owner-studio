<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-b from-white via-gray-50 to-gray-100">
    <!-- Header (optional brand area) -->
    <header class="w-full px-10 py-6 flex justify-between items-center bg-white/70 backdrop-blur-md border-b border-gray-100">
      <h1 class="text-xl font-bold text-slate-800 tracking-tight">StudioSpace Owner</h1>
      <!-- <button class="px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-blue-600 to-green-500 text-white font-medium shadow hover:opacity-90">
        Bantuan
      </button> -->
    </header>

    <!-- Content -->
    <main class="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
      <!-- Left Section -->
      <section class="flex flex-col justify-center px-10 py-16 bg-gradient-to-br from-white to-slate-50 border-r border-gray-100">
        <div class="max-w-lg">
          <h2 class="text-4xl lg:text-5xl font-extrabold text-slate-800 leading-tight">
            Kamu belum punya <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">studio</span>
          </h2>
          <p class="mt-4 text-slate-500 text-base">
            Buat listing studiomu agar pengguna bisa menemukan dan menyewa ruangmu.
            Proses pengajuan cepat — isi beberapa detail, lampirkan foto, dan tim kami akan meninjau.
          </p>

          <div class="mt-8 flex flex-wrap items-center gap-5">
            <button
              @click="openModal"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold shadow-md hover:scale-[1.02] transition-transform"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Buat Studiomu!
            </button>
            <a href="#" class="text-sm text-blue-600 hover:text-slate-800 underline underline-offset-4">
              Lihat panduan pembuatan studio
            </a>
          </div>
        </div>

        <div class="mt-12">
          <p class="text-xs text-slate-400">Diperiksa oleh tim kami dalam 1–2 hari kerja. Siapkan foto dan deskripsi studio terbaikmu.</p>
        </div>
      </section>

      <!-- Right Section: Illustration -->
      <section class="relative flex items-center justify-center p-10 bg-gradient-to-tr from-blue-500 via-white to-green-500">
        <svg viewBox="0 0 900 600" class="w-full max-w-2xl drop-shadow-2xl" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <defs>
            <linearGradient id="grad1" x1="0" x2="1">
              <stop offset="0%" stop-color="#7c3aed" />
              <stop offset="100%" stop-color="#ec4899" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="900" height="600" rx="40" fill="url(#grad1)" opacity="0.08" />
          <g transform="translate(120,80)">
            <rect x="0" y="60" width="500" height="300" rx="24" fill="#fff" opacity="0.96" />
            <rect x="40" y="100" width="180" height="160" rx="8" fill="#f1f5f9" />
            <rect x="260" y="100" width="180" height="160" rx="8" fill="#e2e8f0" />
            <rect x="210" y="200" width="80" height="100" rx="8" fill="url(#grad1)" opacity="0.8" />
            <circle cx="300" cy="140" r="8" fill="#fde68a" />
            <circle cx="340" cy="140" r="8" fill="#fde68a" />
          </g>
        </svg>
      </section>
    </main>

    <!-- Modal -->
    <transition name="modal-fade">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeModal"></div>
        <div class="relative bg-white rounded-2xl w-full max-w-2xl p-6 z-50 drop-shadow-2xl border border-white/30">
          <header class="flex items-start justify-between gap-4 mb-4">
            <div>
              <h3 class="text-lg font-semibold">Form Pengajuan Studio</h3>
              <p class="text-xs text-slate-500">Isi data dasar, tim kami akan meninjau dan menghubungi kamu.</p>
            </div>
            <button @click="closeModal" class="text-slate-400 hover:text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </header>

          <form @submit.prevent="submitForm" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-xs font-medium text-slate-600">Nama Studio</label>
              <input v-model="form.name" required class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Contoh: Studio Suara Jakarta" />
            </div>
            <div>
              <label class="text-xs font-medium text-slate-600">Kota</label>
              <input v-model="form.city" required class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Contoh: Bekasi" />
            </div>
            <div>
              <label class="text-xs font-medium text-slate-600">Kategori</label>
              <select v-model="form.category" class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                <option value="music">Music / Recording</option>
                <option value="photo">Photography / Studio</option>
                <option value="coworking">Co-working / Meeting</option>
              </select>
            </div>
            <div>
              <label class="text-xs font-medium text-slate-600">Nomor Telepon</label>
              <input v-model="form.phone" class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="08xxxxxxxxxx" />
            </div>
            <div class="md:col-span-2">
              <label class="text-xs font-medium text-slate-600">Deskripsi Singkat</label>
              <textarea v-model="form.description" rows="4" class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Ceritakan kelebihan studio, fasilitas, ukuran ruangan..."></textarea>
            </div>
            <div class="md:col-span-2 flex items-center gap-3">
              <label class="text-xs font-medium text-slate-600">Foto Unggahan</label>
              <input type="file" @change="onFileChange" multiple class="ml-auto text-sm text-slate-500" />
            </div>
            <div class="md:col-span-2 flex justify-end gap-3 mt-2">
              <button type="button" @click="closeModal" class="px-4 py-2 rounded-lg border border-slate-200">Batal</button>
              <button type="submit" class="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white">Kirim Pengajuan</button>
            </div>
          </form>
          <p v-if="submitted" class="mt-4 text-sm text-green-600">Pengajuan terkirim! Kami akan menghubungi kamu dalam 1–2 hari kerja.</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const showModal = ref(false)
const submitted = ref(false)

const form = reactive({
  name: '',
  city: '',
  category: 'music',
  phone: '',
  description: '',
  images: []
})

function openModal() {
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  submitted.value = false
}

function onFileChange(e) {
  form.images = Array.from(e.target.files || [])
}

function submitForm() {
  submitted.value = true
  setTimeout(() => {
    closeModal()
  }, 1400)
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
