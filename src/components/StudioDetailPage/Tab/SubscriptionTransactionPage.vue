<template>
    <div class="max-w-6xl mx-auto p-6 bg-gradient-to-r from-green-600 to-blue-500 rounded-2xl py-5 mt-5">
        <!-- TITLE -->
        <h2 class="text-xl font-semibold mb-4 text-white">📄 Histori Subscription</h2>

        <!-- FILTER -->
        <div class="bg-white p-4 rounded-xl shadow mb-4 grid md:grid-cols-5 gap-3 items-end">

            <!-- SEARCH -->
            <div class="flex flex-col">
                <label class="text-xs text-center text-black mb-1">Filter ID Transaksi</label>
                <input v-model="filters.search" type="text" placeholder="ID Transaksi..."
                    class="border rounded px-3 py-2 text-black" />
            </div>

            <!-- STATUS -->
            <div class="flex flex-col">
                <label class="text-xs text-center text-black mb-1">Filter Status Pembayaran</label>
                <select v-model="filters.status" class="border rounded px-3 py-2 text-black">
                    <option value="">Semua Status</option>
                    <option value="success">Sukses</option>
                    <option value="pending">Menunggu</option>
                    <option value="failed">Batal</option>
                </select>
            </div>

            <!-- DATE -->
            <div class="flex flex-col md:col-span-2">
                <label class="text-xs text-center text-black mb-1">Filter Tanggal</label>
                <div class="flex gap-2">
                    <input v-model="filters.start_date" type="date"
                        class="border rounded px-3 py-2 w-full text-black" />
                    <input v-model="filters.end_date" type="date" class="border rounded px-3 py-2 w-full text-black" />
                </div>
            </div>

            <!-- LIMIT -->
            <div class="flex flex-col">
                <label class="text-xs text-center text-black mb-1">Total Data</label>
                <select v-model="filters.limit" class="border rounded px-3 py-2 text-black">
                    <option :value="10">10</option>
                    <option :value="25">25</option>
                    <option :value="50">50</option>
                    <option :value="100">100</option>
                </select>
            </div>

        </div>

        <!-- TABLE -->
        <div class="bg-white rounded-xl shadow overflow-x-auto">
            <table class="w-full text-sm text-left">

                <thead class="bg-amber-200 ">
                    <tr class="text-black">
                        <th class="p-3">No</th>
                        <th class="p-3">ID Transaksi</th>
                        <th class="p-3">Jumlah</th>
                        <th class="p-3">Tanggal</th>
                        <th class="p-3">Status</th>
                        <th class="p-3">Masa Berlaku</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="(item, index) in transactions" :key="item.transaction_id" class="border-t">

                        <td class="p-3 text-black">{{ index + 1 + (page - 1) * filters.limit }}</td>

                        <td class="p-3 text-black">{{ item.transaction_id }}</td>

                        <td class="p-3 text-black">{{ formatRupiah(item.amount) }}</td>

                        <td class="p-3 text-black">{{ formatDate(item.paid_at) }}</td>

                        <td class="p-3 ">
                            <span :class="getStatusClass(item.status)">
                                {{ item.status }}
                            </span>
                        </td>

                        <td class="p-3 text-black">{{ formatDate(item.expired_at) }}</td>

                    </tr>

                    <tr v-if="transactions.length === 0">
                        <td colspan="6" class="text-center p-4 text-gray-500">
                            Tidak ada data
                        </td>
                    </tr>
                </tbody>

            </table>
        </div>

        <!-- PAGINATION -->
        <div class="flex justify-between items-center mt-4">

            <button @click="prevPage" :disabled="page === 1"
                class="px-3 py-1 bg-white! text-black rounded disabled:opacity-70">
                Prev
            </button>

            <p>Page {{ page }}</p>

            <button @click="nextPage" class="px-3 py-1 bg-white! text-black rounded">
                Next
            </button>

        </div>

    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { subscriptionList } from '../../../api/funding'
import { useRouter } from 'vue-router'


const transactions = ref([])
const page = ref(1)
const total = ref(0)

const filters = ref({
    search: '',
    status: '',
    start_date: '',
    end_date: '',
    limit: 10
})

const router = useRouter()


const studio_uuid = router.currentRoute.value.params.studio_uuid


// FETCH API
const fetchSubscriptionList = async () => {
    try {
        let payload = {
            page: page.value,
            limit: filters.value.limit,
            studio_id: studio_uuid
        }

        // conditional fields
        if (filters.value.search) {
            payload.search = filters.value.search
        }

        if (filters.value.status) {
            payload.status = filters.value.status
        }

        if (filters.value.start_date) {
            payload.start_date = filters.value.start_date
        }

        if (filters.value.end_date) {
            payload.end_date = filters.value.end_date
        }


        const response = await subscriptionList(payload)

        transactions.value = response.data.data.data || []
        total.value = response.data.data.total
        page.value = response.data.data.page
    } catch (err) {
        console.error(err)
    }
}

// WATCH FILTER
watch(filters, () => {
    page.value = 1
    fetchSubscriptionList()
}, { deep: true })

// WATCH PAGE
watch(page, fetchSubscriptionList)

// INIT
onMounted(fetchSubscriptionList)

// PAGINATION
const nextPage = () => {
    const maxPage = Math.ceil(total.value / filters.value.limit)
    if (page.value < maxPage) {
        page.value++
    }
}

const prevPage = () => {
    if (page.value > 1) page.value--
}

// FORMAT
const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(val)
}

const formatDate = (val) => {
    if (!val) return '-'
    return new Date(val * 1000).toLocaleString('id-ID')
}

// STATUS COLOR
const getStatusClass = (status) => {
    switch (status) {
        case 'success':
            return 'text-green-600! font-semibold'
        case 'pending':
            return 'text-yellow-600! font-semibold'
        case 'cancelled':
            return 'text-red-600! font-semibold'
        default:
            return ''
    }
}
</script>