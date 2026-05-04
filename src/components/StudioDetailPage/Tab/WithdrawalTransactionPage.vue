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
                <p class="text-xs text-green-600 mt-1">Tersedia untuk ditarik</p>
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
                        class="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 text-black focus:ring-blue-400" />
                    <p class="text-xs text-black mt-1">
                        *Minimal penarikan Rp 50.000
                    </p>
                </div>

                <!-- Tombol Tarik Dana -->
                <div class="w-full md:w-auto">
                    <button @click="handleWithdraw"
                        class="w-full md:w-auto bg-gradient-to-r from-blue-500 to-green-500 hover:opacity-90 text-white px-6 py-2 rounded-lg shadow transition">
                        Tarik Dana
                    </button>
                </div>

            </div>
        </div>
    </div>

    <!-- Modal Ganti Rekening -->
    <div v-if="showBankModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

        <div class="bg-white w-full max-w-md rounded-2xl shadow-lg p-6">

            <!-- Title -->
            <h2 class="text-lg font-semibold mb-4 text-gray-800 text-center">
                Pergantian Akun Bank
            </h2>

            <!-- Form -->
            <div class="space-y-4">

                <!-- Pilih Bank -->
                <div class="relative">
                    <label class="text-sm text-gray-600">Nama Bank</label>

                    <!-- Input -->
                    <input type="text" v-model="searchBank" @focus="showDropdownBank = true" placeholder="Cari nama bank..."
                        class="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" />

                    <!-- Dropdown -->
                    <div v-if="showDropdownBank"
                        class="absolute z-50 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-48 overflow-y-auto shadow text-black">
                        <div v-for="bank in filteredBanks" :key="bank.id" @click="selectBank(bank)"
                            class="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                            {{ bank.name }}
                        </div>

                        <div v-if="filteredBanks.length === 0" class="px-3 py-2 text-sm text-gray-400">
                            Bank tidak ditemukan
                        </div>
                    </div>
                </div>

                <!-- Nomor Rekening -->
                <div>
                    <label class="text-sm text-gray-600">Nomor Rekening</label>
                    <input type="text" v-model="accountNumber" placeholder="Masukkan nomor rekening"
                        @keydown="handleKeydown"
                        class="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-black"
                        :class="accountNumber && accountNumber.length < 5 ? 'border-red-500' : ''" />

                    <p v-if="accountNumber && accountNumber.length < 5" class="text-xs text-red-500 mt-1">
                        Nomor rekening minimal 5 digit
                    </p>
                </div>

            </div>

            <!-- Action -->
            <div class="flex justify-end gap-3 mt-6">
                <button @click="showBankModal = false" class="px-4 py-2 text-sm bg-red-400! rounded-lg">
                    Batal
                </button>

                <button @click="handleSaveBank" :disabled="!accountNumber || accountNumber.length < 5"
                    class="px-4 py-2 text-sm bg-blue-600! text-white rounded-lg">
                    Simpan
                </button>
            </div>

        </div>
    </div>
</template>

<script setup>

import { ref, watch, onMounted, computed } from 'vue'
import { bankListApi, editBankAccountApi, ownerTransactionDetailApi, reconApi } from '../../../api/funding'
import { useRouter } from 'vue-router'
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
        bank_account: ""
    }
})

const withdrawAmount = ref(0)


const studio_uuid = router.currentRoute.value.params.studio_uuid

const loadingRecon = ref(false)
const showBankModal = ref(false)
const bankList = ref([])
const selectedBank = ref('')
const accountNumber = ref('')
const loadingBank = ref(false)
const searchBank = ref('')
const showDropdownBank = ref(false)

const selectBank = (bank) => {
    selectedBank.value = bank.prima_code
    searchBank.value = bank.name
    showDropdownBank.value = false
}


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

const filteredBanks = computed(() => {
    if (!searchBank.value) return bankList.value

    return bankList.value.filter(bank =>
        bank.name.toLowerCase().includes(searchBank.value.toLowerCase())
    )
})

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

    // izinkan control keys
    if (allowedKeys.includes(e.key)) return

    // izinkan angka 0-9
    if (/^[0-9]$/.test(e.key)) return

    // selain itu → block
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

async function handleSaveBank() {
    try {
        const payload = {
            studio_uuid,
            bank_code: selectedBank.value,
            bank_account_number: accountNumber.value

        }

        console.log(payload)

        await editBankAccountApi(payload)
        await fetchOwnerTransactionDetail()

        showBankModal.value = false

    } catch (error) {
        console.log(error)
        alert('Gagal Edit Rekening')
    } 
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

onMounted(async () => {
    await Promise.all([fetchOwnerTransactionDetail()])

})

</script>