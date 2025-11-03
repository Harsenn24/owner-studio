import { ref } from 'vue'
import axios from 'axios'
import { getIpAdresses } from '../../services/axios/ip-adress.services.js'
import { v4 as uuidv4 } from 'uuid'

const email = ref('')
const password = ref('')
const showPassword = ref(false)

function togglePassword() {
    showPassword.value = !showPassword.value
}


async function submitLogin(router) {
    try {
        const BE_BASE_URL = import.meta.env.VITE_STUDIO_BAND_BE_BASE_URL

        const ipAddress = await getIpAdresses()

        const response = await axios.post(
            `${BE_BASE_URL}user/auth/login`,
            {
                email: email.value,
                password: password.value
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

        if (!response.data.status) {
            const message = response.data.message
            if (message === "Email has been limited") {
                return { message: "Email has been limited" }
            }
            throw new Error('Terjadi kesalahan saat login')
        }

        const result = response.data

        if (result.message === "Verification email re-sent") {
            return { message: result.message }
        }

        localStorage.setItem('token', result.data.token)
        localStorage.setItem('device_id', uuidv4())
        router.push('/list-studio')
    } catch (error) {
        console.error(error)
        alert('Terjadi kesalahan saat login')
    }
}

export { email, password, submitLogin, togglePassword, showPassword }
