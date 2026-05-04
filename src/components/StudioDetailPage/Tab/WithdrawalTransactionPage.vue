<template>

    <div class="max-w-7xl mx-auto p-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">

            <!-- Total Transaksi -->
            <div class="bg-red-100 rounded-2xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg transition">
                <p class="text-sm text-gray-500 mb-1">Total Transaksi</p>
                <h2 class="text-2xl font-semibold text-gray-800">{{ formatRupiah(
                    ownerTransactionDetailResult.total_amount) }}</h2>
                <p class="text-xs text-gray-400 mt-1">Dari {{ ownerTransactionDetailResult.total_transaction }}
                    penyewaan</p>
            </div>

            <!-- Total Pendapatan -->
            <div class="bg-blue-100 rounded-2xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg transition">
                <p class="text-sm text-gray-500 mb-1">Total Pendapatan</p>
                <h2 class="text-2xl font-semibold text-gray-800">{{ formatRupiah(ownerTransactionDetailResult.amount) }}
                </h2>
                <p class="text-xs text-gray-400 mt-1">Sudah dikurangi biaya admin</p>
            </div>

            <!-- Saldo Tersedia -->
            <div class="bg-green-100 rounded-2xl p-6 border-2 border-green-300 shadow-md hover:shadow-lg transition">
                <p class="text-sm text-gray-600 mb-1">Saldo Tersedia</p>
                <h2 class="text-2xl font-semibold text-gray-800">{{ formatRupiah(ownerTransactionDetailResult.total_amount_recon_pending) }}</h2>
                <p class="text-xs text-green-600 mt-1">Tersedia untuk ditarik</p>
            </div>

            <!-- Saldo Pencairan -->
            <div class="bg-yellow-100 rounded-2xl p-6 border-2 border-green-300 shadow-md hover:shadow-lg transition">
                <p class="text-sm text-gray-600 mb-1">Saldo Pencairan</p>
                <h2 class="text-2xl font-semibold text-gray-800">{{ formatRupiah(ownerTransactionDetailResult.total_amount_disbursement) }}</h2>
                <p class="text-xs text-green-600 mt-1">Tersedia untuk ditarik</p>
            </div>

        </div>

        <div class="flex justify-center mb-4 mt-4">
            <button @click="fetchRecon" :disabled="loadingRecon"
                class="bg-blue-600! hover:bg-blue-700! text-white px-4 py-2 rounded-lg shadow transition disabled:opacity-50">
                {{ loadingRecon ? 'Processing...' : '🔄 Rekonsiliasi Data' }}
            </button>
        </div>
    </div>
</template>

<script setup>

import { ref, watch, onMounted } from 'vue'
import { ownerTransactionDetailApi, reconApi } from '../../../api/funding'
import { useRouter } from 'vue-router'
const router = useRouter()


const ownerTransactionDetailResult = ref({
    total_transaction: 0,
    total_amount: 0,
    amount: 0,
    total_amount_recon_pending : 0,
    total_amount_disbursement : 0
})

const studio_uuid = router.currentRoute.value.params.studio_uuid

const loadingRecon = ref(false)

const fetchOwnerTransactionDetail = async () => {
    try {
        const payload = {
            studio_uuid
        }

        const response = await ownerTransactionDetailApi(payload)
        const dataResponse = response.data.data
        ownerTransactionDetailResult.value = dataResponse

    } catch (error) {
        console.log(error)
    }
}

const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(val)
}

const fetchRecon = async () => {
    try {
        loadingRecon.value = true

        const payload = {
            studio_id : studio_uuid
        }

        await reconApi(payload)
        await fetchOwnerTransactionDetail()

    } catch (error) {
        console.log(error)
        alert('Gagal melakukan rekonsiliasi')
    } finally {
        loadingRecon.value = false
    }
}

onMounted(async () => {
    await Promise.all([fetchOwnerTransactionDetail()])

})

</script>