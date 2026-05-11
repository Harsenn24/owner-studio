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
                <h2 class="text-2xl font-semibold text-gray-800">{{
                    formatRupiah(ownerTransactionDetailResult.total_amount_recon_pending) }}</h2>
                <p class="text-xs text-green-600 mt-1">Tersedia untuk ditarik</p>
            </div>

            <!-- Saldo Pencairan -->
            <div class="bg-yellow-100 rounded-2xl p-6 border-2 border-green-300 shadow-md hover:shadow-lg transition">
                <p class="text-sm text-gray-600 mb-1">Saldo Pencairan</p>
                <h2 class="text-2xl font-semibold text-gray-800">{{
                    formatRupiah(ownerTransactionDetailResult.total_amount_disbursement) }}</h2>
                <p class="text-xs text-green-600 mt-1">Total Saldo Pencairan</p>
            </div>

        </div>

        <div class="bg-white border border-gray-200 rounded-2xl shadow p-4 mt-6">
            <button @click="fetchRecon" :disabled="loadingRecon"
                class="w-full bg-blue-600! hover:bg-blue-700! text-white px-4 py-2 rounded-lg shadow transition disabled:opacity-50">
                {{ loadingRecon ? 'Processing...' : '🔄 Rekonsiliasi Data' }}
            </button>
        </div>

        <!-- Informasi Rekening Pencairan -->
        <div class="bg-white border border-gray-200 rounded-2xl shadow p-4 mt-6">

            <p class="text-sm font-semibold text-gray-700 mb-3">
                Informasi Rekening Pencairan
            </p>

            <div class="flex flex-col md:flex-row gap-4 items-center">

                <!-- Info Rekening -->
                <div class="flex-1 bg-gray-50 border rounded-lg p-3 text-sm text-gray-700">
                    <div class="flex justify-between items-start gap-4">

                        <!-- Info Rekening -->
                        <div>
                            <p class="font-medium">
                                {{ ownerTransactionDetailResult.bank.bank_name }}

                            </p>
                            <p>{{ ownerTransactionDetailResult.bank.bank_account }}</p>
                        </div>

                        <!-- Tombol -->
                        <button @click="handleChangeBank"
                            class="text-xs bg-blue-500! hover:bg-blue-600! text-white px-3 py-1 rounded-lg shadow whitespace-nowrap">
                            Ganti Nomor Rekening
                        </button>

                    </div>
                </div>

                <!-- Input Nominal -->
                <div class="flex-1 w-full">
                    <label class="text-xs text-gray-500">Jumlah Penarikan</label>
                    <input type="text" :value="formattedWithdraw" @input="handleInput" @keydown="handleKeydown"
                        placeholder="Rp 0"
                        class="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 text-black focus:ring-blue-400"
                        :class="showErrorInputWithDraw ? 'border-red-500!' : 'border-gray-300'" />

                    <p class="text-xs mt-2 min-h-[16px]"
                        :class="withdrawErrorMessage ? 'text-red-500!' : 'text-transparent'">
                        {{ withdrawErrorMessage || '.' }}
                    </p>
                </div>

                <!-- Tombol Tarik Dana -->
                <div class="w-full md:w-auto">
                    <button @click="handleTransfer" :disabled="!isValidWithdraw" :class="[
                        'w-full md:w-auto text-white px-6 py-2 rounded-lg shadow transition',
                        isValidWithdraw
                            ? 'bg-gradient-to-r from-blue-500 to-green-500 hover:opacity-90'
                            : 'bg-gray-400! cursor-not-allowed'
                    ]">
                        Tarik Dana
                    </button>


                </div>

            </div>
        </div>
    </div>

    <ModalEditBankPage :show="showBankModal" :bankList="bankList" @close="showBankModal = false"
        @success="fetchOwnerTransactionDetail" />

    <ModalTransferPage :show="showTransferModal" @close="showTransferModal = false; fetchOwnerTransactionDetail();"
        :withdrawAmount="withdrawAmount" :adminFeeTransfer="adminFeeTransfer" :totalTransfer="totalTransfer"
        :transactionDetail="ownerTransactionDetailResult" />

</template>

<script setup>

import { ref, onMounted, computed } from 'vue'
import { bankListApi, ownerTransactionDetailApi, reconApi, adminTransferFeeApi } from '../../../api/funding'
import { useRouter } from 'vue-router'
import ModalEditBankPage from './ModalEditBankPage.vue'
import ModalTransferPage from './ModalTransferPage.vue'
const router = useRouter()


const ownerTransactionDetailResult = ref({
    total_transaction: 0,
    total_amount: 0,
    amount: 0,
    total_amount_recon_pending: 0,
    total_amount_disbursement: 0,
    bank: {
        bank_name: "",
        bank_alias: "",
        bank_account: "",
        bank_code: ""
    }
})

const withdrawAmount = ref(0)
const MIN_WITHDRAW = 50000
const studio_uuid = router.currentRoute.value.params.studio_uuid
const loadingRecon = ref(false)
const showBankModal = ref(false)
const bankList = ref([])
const loadingBank = ref(false)
const showTransferModal = ref(false)
const adminFeeTransfer = ref(0)
const totalTransfer = ref(0)

const isValidWithdraw = computed(() => {
    return withdrawAmount.value >= MIN_WITHDRAW && withdrawAmount.value + adminFeeTransfer.value <= ownerTransactionDetailResult.value.total_amount_recon_pending
})

const showErrorInputWithDraw = computed(() => {
    return withdrawAmount.value > 0 && withdrawAmount.value < MIN_WITHDRAW
})

const withdrawErrorMessage = computed(() => {
    if (!withdrawAmount.value || withdrawAmount.value < MIN_WITHDRAW) {
        return `Minimal penarikan Rp ${MIN_WITHDRAW.toLocaleString('id-ID')}`
    }

    if (
        withdrawAmount.value + adminFeeTransfer.value >
        ownerTransactionDetailResult.value.total_amount_recon_pending
    ) {
        return 'Saldo tidak mencukupi'
    }

    return ''
})

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


const formatRupiahv2 = (val) => {
    if (!val) return 'Rp 0'
    return 'Rp ' + Number(val).toLocaleString('id-ID')
}

const formattedWithdraw = computed(() => {
    return formatRupiahv2(withdrawAmount.value)
})

const handleInput = (e) => {
    let value = e.target.value

    value = value.replace(/\D/g, '')

    withdrawAmount.value = value ? Number(value) : 0
}

const handleKeydown = (e) => {
    const allowedKeys = [
        'Backspace',
        'Delete',
        'ArrowLeft',
        'ArrowRight',
        'Tab'
    ]

    if (allowedKeys.includes(e.key)) return
    if (/^[0-9]$/.test(e.key)) return
    e.preventDefault()
}

const handleChangeBank = async () => {
    showBankModal.value = true

    try {
        loadingBank.value = true

        const res = await bankListApi({ search: "" })
        bankList.value = res.data?.data.data || []

    } catch (err) {
        console.log(err)
        alert('Gagal memuat data bank')
    } finally {
        loadingBank.value = false
    }
}

const handleTransfer = async () => {
    await fetchOwnerTransactionDetail()
    await fetchAdminTransferFee()
    totalTransfer.value = withdrawAmount.value + adminFeeTransfer.value
    showTransferModal.value = true
}

const fetchRecon = async () => {
    try {
        loadingRecon.value = true

        const payload = {
            studio_id: studio_uuid
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

const fetchAdminTransferFee = async () => {
    try {
        const response = await adminTransferFeeApi()
        const dataResponse = response.data.data
        adminFeeTransfer.value = dataResponse.admin_transfer

    } catch (error) {
        console.log(error)
        alert('Gagal memuat fee transfer')
    }
}

onMounted(async () => {
    await Promise.all([fetchOwnerTransactionDetail(), fetchAdminTransferFee()])
})

</script>