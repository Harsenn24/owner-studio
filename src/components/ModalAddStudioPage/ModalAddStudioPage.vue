<template>
    <transition name="modal-fade">
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeModal"></div>
            <div class="relative bg-white rounded-2xl w-full max-w-2xl p-6 z-50 drop-shadow-2xl border border-white/30">
                <header class="flex items-start justify-between gap-4 mb-4">
                    <h3 class="text-lg font-semibold text-black">Form Pengajuan Studio</h3>
                    <button @click="closeModal" class="text-slate-400 hover:text-slate-600">✖️</button>
                </header>

                <form @submit.prevent="submitForm">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Nama Studio -->
                        <div>
                            <label class="text-xs font-medium text-slate-600">Nama Studio</label>
                            <input v-model="form.name" @input="handleNameInput" required minlength="5" maxlength="20"
                                class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-black text-black"
                                placeholder="Contoh: Studio Suara Jakarta" />
                            <p v-if="form.name.length > 0 && (form.name.length < 5 || form.name.length > 20)"
                                class="text-xs text-red-500 mt-1">
                                Nama studio harus antara 5–20 karakter.
                            </p>
                        </div>

                        <!-- Provinsi -->
                        <div class="relative" ref="provinceContainer">
                            <label class="text-xs font-medium text-slate-600">Provinsi</label>
                            <input type="text" v-model="provinceSearch" @input="fetchProvinces" @focus="fetchProvinces"
                                placeholder="Cari provinsi..."
                                class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-black text-black!" />
                            <ul v-if="provinceList.length"
                                class="absolute w-full max-h-48 overflow-auto border rounded mt-1 bg-white z-50 text-black! py-2">
                                <li v-for="province in provinceList" :key="province.id"
                                    @click="selectProvince(province)"
                                    class="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                                    {{ province.name }}
                                </li>
                            </ul>
                        </div>
                        <!-- Kota -->
                        <div class="relative" ref="cityContainer">
                            <label class="text-xs font-medium text-slate-600">Kota</label>
                            <input type="text" v-model="citySearch" @input="fetchCities()" @focus="fetchCities()"
                                placeholder="Cari kota..."
                                class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-black text-black!" />
                            <ul v-if="cityList.length"
                                class="absolute w-full max-h-48 overflow-auto border rounded mt-1 bg-white z-50 text-black! py-2">
                                <li v-for="city in cityList" :key="city.id" @click="selectCities(city)"
                                    class="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                                    {{ city.name }}
                                </li>
                            </ul>
                        </div>
                        <!-- Kecamatan -->
                        <div class="relative" ref="districtContainer">
                            <label class="text-xs font-medium text-slate-600">Kecamatan</label>
                            <input type="text" v-model="districtSearch" @input="fetchDistricts()"
                                @focus="fetchDistricts()" placeholder="Cari kecamatan..."
                                class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-black text-black!" />
                            <ul v-if="districtList.length"
                                class="absolute w-full max-h-48 overflow-auto border rounded mt-1 bg-white z-50 text-black! py-2">
                                <li v-for="district in districtList" :key="district.id"
                                    @click="selectDistrict(district)"
                                    class="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                                    {{ district.name }}
                                </li>
                            </ul>
                        </div>
                        <!-- Kelurahan -->
                        <div class="relative" ref="villageContainer">
                            <label class="text-xs font-medium text-slate-600">Kelurahan</label>
                            <input type="text" v-model="villageSearch" @input="fetchVillages()" @focus="fetchVillages()"
                                placeholder="Cari kelurahan..."
                                class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-black text-black!" />
                            <ul v-if="villageList.length"
                                class="absolute w-full max-h-48 overflow-auto border rounded mt-1 bg-white z-50 text-black! py-2">
                                <li v-for="village in villageList" :key="village.id" @click="selectVillage(village)"
                                    class="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                                    {{ village.name }}
                                </li>
                            </ul>
                        </div>
                        <!-- Kode Pos -->
                        <div class="relative" ref="postalCodeContainer">
                            <label class="text-xs font-medium text-slate-600">Kode Pos</label>
                            <input type="text" v-model="postalCodeSearch" @input="fetchPostalCode()"
                                @focus="fetchPostalCode()" placeholder="Cari kode pos..."
                                class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-black text-black!" />
                            <ul v-if="postalCodeList.length"
                                class="absolute w-full max-h-48 overflow-auto border rounded mt-1 bg-white z-50 text-black! py-2">
                                <li v-for="postal_code in postalCodeList" :key="postal_code.id"
                                    @click="selectPostalCode(postal_code)"
                                    class="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                                    {{ postal_code.postal_code }}
                                </li>
                            </ul>
                        </div>
                        <!-- Google Maps -->
                        <div>
                            <label class="text-xs font-medium text-slate-600">Tautan Google Maps</label>
                            <input v-model="form.gmaps" @input="handleGmapsInput" required
                                class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-black text-black"
                                placeholder="https://maps.app.goo.gl/..." />
                            <p v-if="form.gmaps && form.gmaps.length < 5" class="text-xs text-red-500 mt-1">
                                Tautan minimal 5 karakter.
                            </p>
                            <p v-else-if="form.gmaps && !isValidUrl(form.gmaps)" class="text-xs text-red-500 mt-1">
                                Harus berupa tautan (URL) yang valid.
                            </p>
                        </div>

                    </div>

                    <!-- Alamat Lengkap -->
                    <div>
                        <label class="text-xs font-medium text-slate-600">Alamat Lengkap</label>
                        <textarea v-model="form.address" @input="handleAddressInput" required rows="3"
                            class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-black text-black resize-none overflow-hidden"
                            placeholder="Contoh: Jalan Sukmajaya 1 No. 23, Depok"></textarea>

                        <p v-if="form.address && form.address.length < 10" class="text-xs text-red-500 mt-1">
                            Alamat minimal 10 karakter.
                        </p>
                    </div>


                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Contact Person Name -->
                        <div>
                            <label class="text-xs font-medium text-slate-600">Contact Person Name</label>
                            <input v-model="form.contactName" @input="handleContactNameInput" required minlength="5"
                                maxlength="20"
                                class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-black text-black"
                                placeholder="Contoh: Dhimas" />
                            <p v-if="form.contactName.length > 0 && (form.contactName.length < 5 || form.contactName.length > 20)"
                                class="text-xs text-red-500 mt-1">
                                Nama contact person harus antara 5–20 karakter.
                            </p>
                        </div>
                        <!-- Contact Person Phone -->
                        <div>
                            <label class="text-xs font-medium text-slate-600">Contact Person Phone</label>
                            <input v-model="form.contactPhone" @input="handlePhoneInput" required maxlength="15"
                                class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-black text-black"
                                placeholder="Contoh: 08135115415" />

                            <p v-if="phoneError" class="text-xs text-red-500 mt-1">
                                {{ phoneError }}
                            </p>
                        </div>

                        <!-- Bank -->
                        <div class="relative" ref="provinceContainer">
                            <label class="text-xs font-medium text-slate-600">Bank</label>
                            <input type="text" v-model="bankSearch" @input="fetchBank" @focus="fetchBank"
                                placeholder="nama bank..."
                                class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-black text-black!" />
                            <ul v-if="bankList.length"
                                class="absolute w-full max-h-48 overflow-auto border rounded mt-1 bg-white z-50 text-black! py-2">
                                <li v-for="bank in bankList" :key="bank.id" @click="selectBank(bank)"
                                    class="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                                    {{ bank.name }}
                                </li>
                            </ul>
                        </div>
                        <!-- Nomor Rekening Bank -->
                        <div>
                            <label class="text-xs font-medium text-slate-600">Nomor Rekening Bank</label>
                            <input v-model="form.bankAccount" @input="handleBankAccountInput" required minlength="5"
                                maxlength="20"
                                class="mt-2 w-full rounded-lg border px-3 py-2 text-sm border-black text-black"
                                placeholder="Contoh: 5544512536" />
                            <p v-if="form.bankAccount && form.bankAccount.length < 5" class="text-xs text-red-500 mt-1">
                                Nomor Rekening minimal 5 karakter.
                            </p>
                        </div>

                    </div>

                    <!-- Upload Images -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                        <!-- Upload KTP -->
                        <div>
                            <label class="text-sm font-medium text-slate-700">Upload KTP</label>

                            <input v-if="!previewFile.ktp" type="file" accept="image/*" required
                                @change="handleFileUpload($event, 'ktp')"
                                class="mt-2 w-full rounded-lg border px-3 py-3 text-sm border-black text-black cursor-pointer" />

                            <div v-else
                                class="mt-3 relative rounded-lg overflow-hidden border border-gray-300 shadow-md">
                                <img :src="previewFile.ktp" alt="Preview KTP"
                                    class="w-full aspect-[16/9] object-cover" />
                                <button @click="removeFile('ktp')"
                                    class="absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-opacity-100 text-xs font-medium px-2 py-1 rounded shadow">
                                    Ganti Foto
                                </button>
                            </div>

                            <p v-if="errorsFile.ktp" class="text-xs text-red-500 mt-1">{{ errorsFile.ktp }}</p>
                        </div>

                        <!-- Upload Studio 1 -->
                        <div>
                            <label class="text-sm font-medium text-slate-700">Upload Foto Studio 1</label>

                            <input v-if="!previewFile.studio1" type="file" accept="image/*" required
                                @change="handleFileUpload($event, 'studio1')"
                                class="mt-2 w-full rounded-lg border px-3 py-3 text-sm border-black text-black cursor-pointer" />

                            <div v-else
                                class="mt-3 relative rounded-lg overflow-hidden border border-gray-300 shadow-md">
                                <img :src="previewFile.studio1" alt="Preview Studio 1"
                                    class="w-full aspect-[16/9] object-cover" />
                                <button @click="removeFile('studio1')"
                                    class="absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-opacity-100 text-xs font-medium px-2 py-1 rounded shadow">
                                    Ganti Foto
                                </button>
                            </div>

                            <p v-if="errorsFile.studio1" class="text-xs text-red-500 mt-1">{{ errorsFile.studio1 }}</p>
                        </div>

                        <!-- Upload Studio 2 -->
                        <div>
                            <label class="text-sm font-medium text-slate-700">Upload Foto Studio 2</label>

                            <input v-if="!previewFile.studio2" type="file" accept="image/*" required
                                @change="handleFileUpload($event, 'studio2')"
                                class="mt-2 w-full rounded-lg border px-3 py-3 text-sm border-black text-black cursor-pointer" />

                            <div v-else
                                class="mt-3 relative rounded-lg overflow-hidden border border-gray-300 shadow-md">
                                <img :src="previewFile.studio2" alt="Preview Studio 2"
                                    class="w-full aspect-[16/9] object-cover" />
                                <button @click="removeFile('studio2')"
                                    class="absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-opacity-100 text-xs font-medium px-2 py-1 rounded shadow">
                                    Ganti Foto
                                </button>
                            </div>

                            <p v-if="errorsFile.studio2" class="text-xs text-red-500 mt-1">{{ errorsFile.studio2 }}</p>
                        </div>
                    </div>


                    <!-- Buttons -->
                    <div class="md:col-span-2 flex justify-end gap-3 mt-4">
                        <button type="button" @click="closeModal"
                            class="px-4 py-2 rounded-lg border border-slate-200">Batal</button>
                        <button type="submit"
                            class="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white">Kirim
                            Pengajuan</button>
                    </div>
                </form>

            </div>
        </div>
    </transition>
</template>
<script setup>
import { ref } from "vue";

// props hanya untuk showModal
const props = defineProps({
    showModal: Boolean,
});

const errorsFile = ref({ ktp: '', studio1: '', studio2: '' })


const emit = defineEmits(["close"]); // tidak ada "submit" karena submit sekarang internal

function closeModal() {
    emit("close");
}

// ------------------------
// STATE FORM
// ------------------------
const form = ref({
    name: '',
    city: '',
    district: '',
    gmaps: '',
    province: '',
    postalCode: '',
    bank: '',
    bankAccount: '',
    contactName: '',
    contactPhone: '',
    document_ids: []
});

// ------------------------
// HANDLERS
// ------------------------
function handleNameInput(e) {
    let value = e.target.value

    value = value
        .toLowerCase()
        .replace(/\b\w/g, char => char.toUpperCase())

    form.name = value
}
function handleAddressInput(e) {
    const textarea = e.target

    textarea.style.height = 'auto'
    textarea.style.height = textarea.scrollHeight + 'px'

    if (form.address && form.address.length < 10) {
        console.warn('Alamat terlalu pendek')
    }
}
function handlePhoneInput() {
    const value = form.contactPhone

    form.contactPhone = value.replace(/\D/g, '')

    if (!form.contactPhone.startsWith('08')) {
        phoneError.value = 'Nomor harus diawali dengan 08.'
    } else if (form.contactPhone.length < 10) {
        phoneError.value = 'Nomor minimal 10 digit.'
    } else if (form.contactPhone.length > 15) {
        phoneError.value = 'Nomor maksimal 15 digit.'
    } else {
        phoneError.value = ''
    }
}
function handleBankAccountInput() {
    form.bankAccount = form.bankAccount.replace(/\D/g, '')
}
// dan semua handlers lainnya

// ------------------------
// FILE UPLOAD
// ------------------------
const previewFile = ref({
    ktp: null,
    studio1: null,
    studio2: null,
});
function handleFileUpload(e, type) {
    const file = event.target.files[0]
    if (!file) return

    errorsFile.value[type] = ''

    // Validasi ukuran file (maksimal 500 KB)
    if (file.size > 500 * 1024) {
        errorsFile.value[type] = 'Ukuran file maksimal 500 KB.'
        return
    }

    // Preview langsung (tanpa validasi rasio)
    const fileUrl = URL.createObjectURL(file)
    previewFile.value[type] = fileUrl

    // Tentukan module name
    const moduleName = type === 'ktp' ? 'studio.ktp' : 'studio.photo'

    try {
        const BE_BASE_URL = import.meta.env.VITE_STUDIO_BAND_BE_BASE_URL
        const token = localStorage.getItem('token')
        const deviceId = localStorage.getItem('device_id')
        const ip = await getIpAdresses()

        const formData = new FormData()
        formData.append('image', file)
        formData.append('module', moduleName)

        const response = await axios.post(`${BE_BASE_URL}owner/file/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'authorization': `Bearer ${token}`,
                'x-device-id': deviceId,
                'x-ip-address': ip,
                'x-request-id': uuidv4()
            }
        })

        if (!response.data.status) {
            errorsFile.value[type] = 'Upload gagal. Silakan coba lagi.'
        } else {
            console.log(`✅ ${type} berhasil diupload:`, response.data.data)
            form.document_ids.push(response.data.data.file_id)
        }
    } catch (err) {
        console.error(err)
        errorsFile.value[type] = 'Terjadi kesalahan saat upload.'
    }
}
function removeFile(type) {
    previewFile.value[type] = null
    errorsFile.value[type] = ''
}


// ------------------------
// SUBMIT LANGSUNG DI MODAL
// ------------------------
async function submitForm() {
    try {
        // validasi manual kalau perlu
        if (!form.value.name || form.value.name.length < 5) {
            return alert("Nama studio minimal 5 karakter");
        }

        // contoh call API
        const body = new FormData();
        body.append("name", form.value.name);
        body.append("address", form.value.address);
        body.append("gmaps", form.value.gmaps);
        // append file
        // append lainnya

        const res = await fetch("/api/studio/submit", {
            method: "POST",
            body,
        });

        const json = await res.json();
        if (!json.success) {
            return alert("Gagal: " + json.message);
        }

        alert("Pengajuan berhasil!");
        closeModal();

    } catch (err) {
        console.error(err);
        alert("Terjadi kesalahan server");
    }
}
</script>
