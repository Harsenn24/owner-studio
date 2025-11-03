<template>
    <!-- Overlay -->
    <div
        class="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50 transition-opacity duration-300">
        <!-- Modal Box dengan animasi muncul dari bawah -->
        <div
            class="bg-gray-300 bg-opacity-90 p-8 rounded-2xl shadow-lg w-full max-w-md text-center m-4 transform transition-all duration-300 translate-y-10 opacity-0 animate-slideUp">
            <div class="flex flex-col items-center justify-center space-y-4">
                <img src="https://cdn-icons-png.flaticon.com/512/463/463612.png" alt="Limit Reached"
                    class="w-24 h-24" />
                <h2 class="text-xl font-semibold text-gray-800">Batas Pengiriman Email Harian Tercapai</h2>
                <p class="text-lg text-gray-700">
                    Silakan coba lagi besok ya. Terima kasih atas pengertiannya! 🙂
                </p>
                <button @click="handleClose"
                    class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200">
                    Tutup
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    handleClose: Function
})
</script>

<style scoped>
@keyframes slideUp {
    from {
        transform: translateY(100%);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.animate-slideUp {
    animation: slideUp 0.4s ease-out forwards;
}
</style>
