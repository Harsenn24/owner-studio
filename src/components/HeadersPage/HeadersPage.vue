<template>
    <header class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-slate-800">StudioSpace Owner</h1>

        <div class="flex justify-between gap-x-4">

            <div v-if="studioList.length > 0 || checkSubmissionStatus === 'rejected'">
                <button @click="$emit('open-modal')"
                    class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-green-500 text-white font-medium shadow hover:opacity-90 transition-all">
                    + Tambah Studio
                </button>
            </div>

            <button @click="$emit('logout')"
                class="px-5 py-2.5 rounded-xl bg-red-500! text-white! font-medium shadow hover:opacity-90 transition-all">
                LogOut
            </button>

        </div>
    </header>
</template>

<script setup>
defineProps({
    studioList: { type: Array, default: () => [] },
    checkSubmissionStatus: { type: String, default: '' }
})
</script>