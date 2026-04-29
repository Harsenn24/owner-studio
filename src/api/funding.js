import axios from "axios";
import { getIpAdresses } from "../services/axios/ip-adress.services";
import { v4 as uuidv4 } from 'uuid'


const BE_BASE_URL = import.meta.env.VITE_STUDIO_BAND_BE_BASE_URL
const token = localStorage.getItem('token')
const deviceId = localStorage.getItem('device_id')
const ip = await getIpAdresses()

async function subscriptionList(payload) {
    const response = await axios({
        method: 'POST',
        url: `${BE_BASE_URL}owner/funding/subscription/list`,
        headers: {
            'authorization': `Bearer ${token}`,
            'x-device-id': deviceId,
            'x-ip-address': ip,
            'x-request-id': uuidv4()
        },
        data: payload
    })

    return response
}

async function rentList(payload) {
    const response = await axios({
        method: 'POST',
        url: `${BE_BASE_URL}owner/funding/transaction/list`,
        headers: {
            'authorization': `Bearer ${token}`,
            'x-device-id': deviceId,
            'x-ip-address': ip,
            'x-request-id': uuidv4()
        },
        data: payload
    })

    return response
}

export { subscriptionList, rentList }