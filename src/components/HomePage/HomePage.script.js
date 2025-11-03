import { ref } from 'vue'
import axios from 'axios'
import { getIpAdresses } from '../../services/axios/ip-adress.services.js'
import { v4 as uuidv4 } from 'uuid'

const email = ref('')

async function submitEmail(router) {
  try {

    const BE_BASE_URL = import.meta.env.VITE_STUDIO_BAND_BE_BASE_URL


    let device_id = localStorage.getItem('device_id')

    if (!device_id) {
      device_id = uuidv4()
      localStorage.setItem('device_id', device_id)
    }

    const ipAddress = await getIpAdresses()


    const response = await axios.post(
      `${BE_BASE_URL}user/auth/check-user`,
      { email: email.value },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-ip-address': ipAddress,
          'x-device-id': device_id,
          'x-request-id': uuidv4()
        },
      }
    )

    if (!response.data.status) throw new Error('Gagal check user')

    const result = response.data.data
    if (result.user) {
      router.push('/login')
    } else {
      router.push('/register')
    }
  } catch (error) {
    console.error(error)
    alert('Terjadi kesalahan saat pengecekan email email')
  }
}

export { email, submitEmail }
