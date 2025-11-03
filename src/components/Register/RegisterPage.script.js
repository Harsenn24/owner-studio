import { ref } from 'vue'
import axios from 'axios'
import { getIpAdresses } from '../../services/axios/ip-adress.services.js'
import { v4 as uuidv4 } from 'uuid'


const email = ref('')
const password = ref('')
const name = ref('')
const showPassword = ref(false)

function togglePassword() {
    showPassword.value = !showPassword.value
}

async function submitRegister(router) {
    try {

        const ipAddress = await getIpAdresses()

        const device_id = localStorage.getItem('device_id')
        if (!device_id) {
            router.push('/')
        }

        const BE_BASE_URL = import.meta.env.VITE_STUDIO_BAND_BE_BASE_URL
        const response = await axios.post(
            `${BE_BASE_URL}user/auth/register`,
            {
                email: email.value,
                password: password.value,
                name: name.value
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-ip-address': ipAddress,
                    'x-device-id': '454545',
                    'x-request-id': uuidv4()
                },
            }
        )

        if (!response.data.status) throw new Error('Gagal login')
        return true
    } catch (error) {
        console.error(error)
        alert('Terjadi kesalahan saat login')
        return false
    }
}

export { email, password, name, submitRegister, togglePassword , showPassword}
