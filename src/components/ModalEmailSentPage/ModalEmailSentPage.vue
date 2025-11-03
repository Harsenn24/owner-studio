<template>
    <!-- Overlay -->
    <div
        class="fixed inset-0 bg-opacity-50! flex items-end md:items-center justify-center z-50 transition-opacity duration-300">
        <!-- Modal Box dengan animasi muncul dari bawah -->
        <div
            class="bg-gray-300 bg-opacity-30! p-8 rounded-2xl shadow-lg w-full max-w-md text-center m-4 transform transition-all duration-300 translate-y-10 opacity-0 animate-slideUp">
            <div class="flex flex-col items-center justify-center space-y-4">
                <img src="https://i.pinimg.com/736x/30/d4/1b/30d41b81c10848151dc5a067725f9cf2.jpg" alt="Email Sent"
                    class="w-24 h-24" />
                <h2 class="text-xl font-semibold text-gray-800">Email konfirmasi sudah dikirim</h2>
                <p class="text-sm text-gray-600">
                    Silakan periksa kotak masuk atau folder spam Anda untuk melanjutkan proses.
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
