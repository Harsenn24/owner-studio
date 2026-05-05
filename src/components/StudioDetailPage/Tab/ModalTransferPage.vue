<template>
    <div v-if="show" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

        <div class="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6">

            <!-- Header -->
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold text-gray-800">Tarik Dana</h2>
                <button @click="$emit('close')"
                    class="bg-white!  border border-gray-300! text-black hover:text-gray-600! hover:border-black! text-xl">×</button>
            </div>

            <p class="text-sm text-gray-500 mb-4">
                Mohon periksa kembali detail penarikan dana Anda
            </p>

            <!-- Detail -->
            <div class="space-y-3 text-sm text-gray-700">

                <div class="flex justify-between">
                    <span>Nama Bank</span>
                    <span class="font-medium">{{ transactionDetail?.bank?.bank_name }}</span>
                </div>

                <div class="flex justify-between">
                    <span>Rekening Tujuan</span>
                    <span class="font-medium">{{ transactionDetail?.bank?.bank_account }}</span>
                </div>

                <div class="flex justify-between">
                    <span>Pemilik Rekening</span>
                    <span class="font-medium">John Doe</span>
                </div>

                <hr class="my-2" />

                <div class="flex justify-between">
                    <span>Dana</span>
                    <span class="font-medium">{{ formatRupiah(props.withdrawAmount) }}</span>
                </div>

                <div class="flex justify-between">
                    <span>Biaya Admin</span>
                    <span class="font-medium">{{ formatRupiah(props.adminFeeTransfer) }}</span>
                </div>

                <!-- Total -->
                <div class="flex justify-between bg-blue-50 rounded-lg px-3 py-2 mt-2">
                    <span class="font-semibold text-blue-600">Total Dana</span>
                    <span class="font-bold text-blue-600">{{ formatRupiah(props.totalTransfer) }}</span>
                </div>

            </div>

            <!-- Actions -->
            <div class="flex gap-3 mt-6">
                <button @click="$emit('close')"
                    class="w-full bg-gray-200! hover:bg-gray-300! text-gray-700 py-2 rounded-lg">
                    Batal
                </button>

                <button @click="handleConfirm"
                    class="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-2 rounded-lg hover:opacity-90">
                    Konfirmasi Tarik Dana
                </button>
            </div>

        </div>
    </div>
</template>

<script setup>

const props = defineProps({
    show: Boolean,
    transactionDetail: Object,
    withdrawAmount: Number,
    adminFeeTransfer: Number,
    totalTransfer: Number
})

const formatRupiah = (val) => {
    return 'Rp ' + Number(val || 0).toLocaleString('id-ID')
}

const emit = defineEmits(['close', 'confirm'])

const handleConfirm = () => {
    emit('confirm')
    emit('close')
}

</script>