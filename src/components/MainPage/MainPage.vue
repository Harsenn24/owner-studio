<template>
    <div
        class="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-blue-300 to-blue-100 relative">
        <div class="grid grid-cols-1 gap-4 p-4 w-100 max-w-md sm:max-w-lg mx-auto">
            <!-- Tombol Logout -->
            <button @click="showModal = true"
                class="bg-transparent! text-black font-extrabold leading-none -mt-1 -mb-3 outline-none focus:ring-0 border-none text-right ml-80">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                    stroke="currentColor" class="w-10 h-10">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H3" />
                </svg>
            </button>

            <slot />
        </div>

        <!-- Modal Konfirmasi -->
        <div v-if="showModal" class="fixed inset-0 flex items-center justify-center  bg-opacity-30! backdrop-blur-sm! z-50 transition-all duration-300">
            <div class="bg-white! rounded-xl p-6 w-80 text-center shadow-lg">
                <h2 class="text-lg font-semibold mb-4 text-black">Kamu yakin mau keluar?</h2>

                <div class="flex justify-center space-x-4">
                    <button @click="confirmLogout"
                        class="bg-red-500! hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg">
                        Yes
                    </button>
                    <button @click="showModal = false"
                        class="bg-blue-500! hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
                        No
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            showModal: false
        };
    },
    methods: {
        confirmLogout() {
            this.showModal = false;
            localStorage.removeItem("token");
            this.$router.push("/login");
        }
    }
};
</script>