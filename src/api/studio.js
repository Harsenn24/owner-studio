import axios from "axios";
import { getIpAdresses } from "../services/axios/ip-adress.services";
import { v4 as uuidv4 } from 'uuid'


const BE_BASE_URL = import.meta.env.VITE_STUDIO_BAND_BE_BASE_URL
const token = localStorage.getItem('token')
const deviceId = localStorage.getItem('device_id')
const ip = await getIpAdresses()

async function listStudio(page, search) {
    const response = await axios({
        method: 'POST',
        url: `${BE_BASE_URL}owner/studio/list`,
        headers: {
            'authorization': `Bearer ${token}`,
            'x-device-id': deviceId,
            'x-ip-address': ip,
            'x-request-id': uuidv4()
        },
        data: {
            page,
            limit: 6,
            search
        }
    })

    return response
}

async function submission() {
    const response = await axios({
        method: 'POST',
        url: `${BE_BASE_URL}owner/studio/submission/check`,
        headers: {
            'authorization': `Bearer ${token}`,
            'x-device-id': deviceId,
            'x-ip-address': ip,
            'x-request-id': uuidv4()
        },
        data: {}
    })

    return response
}

async function studioNumberOwner(studio_uuid) {
    const response = await axios({
        method: 'POST',
        url: `${BE_BASE_URL}owner/studio/studio-number/list`,
        headers: {
            'authorization': `Bearer ${token}`,
            'x-device-id': deviceId,
            'x-ip-address': ip,
            'x-request-id': uuidv4()
        },
        data: {
            page: 1,
            limit: 10000,
            studio_uuid,
        }
    })

    return response
}

async function submitStudioNumber(payload) {
    const response = await axios({
        method: 'POST',
        url: `${BE_BASE_URL}owner/studio/studio-number/create`,
        headers: {
            'authorization': `Bearer ${token}`,
            'x-device-id': deviceId,
            'x-ip-address': ip,
            'x-request-id': uuidv4()
        },
        data: { ...payload }
    })

    return response
}

async function studioNumberDetail(studio_number_uuid, studio_uuid) {
    const response = await axios({
        method: 'POST',
        url: `${BE_BASE_URL}owner/studio/studio-number/detail`,
        headers: {
            'authorization': `Bearer ${token}`,
            'x-device-id': deviceId,
            'x-ip-address': ip,
            'x-request-id': uuidv4()
        },
        data: {
            studio_number_uuid,
            studio_uuid
        }
    })

    return response
}

async function editStudioNumber(payload) {
    const response = await axios({
        method: 'POST',
        url: `${BE_BASE_URL}owner/studio/studio-number/edit`,
        headers: {
            'authorization': `Bearer ${token}`,
            'x-device-id': deviceId,
            'x-ip-address': ip,
            'x-request-id': uuidv4()
        },
        data: { ...payload }
    })

    return response
}

async function subscriptionPrice() {
    const response = await axios({
        method: 'POST',
        url: `${BE_BASE_URL}owner/studio/subscription/price`,
        headers: {
            'authorization': `Bearer ${token}`,
            'x-device-id': deviceId,
            'x-ip-address': ip,
            'x-request-id': uuidv4()
        },
        data: {}
    })

    return response
}

async function checkQrSubscription(studio_uuid) {
    const response = await axios({
        method: 'POST',
        url: `${BE_BASE_URL}owner/studio/subscription/qr/check`,
        headers: {
            'authorization': `Bearer ${token}`,
            'x-device-id': deviceId,
            'x-ip-address': ip,
            'x-request-id': uuidv4()
        },
        data: {
            studio_id : studio_uuid
        }
    })

    return response
}

async function subscribeStudio(studio_uuid) {
    const response = await axios({
        method: 'POST',
        url: `${BE_BASE_URL}owner/studio/subscription`,
        headers: {
            'authorization': `Bearer ${token}`,
            'x-device-id': deviceId,
            'x-ip-address': ip,
            'x-request-id': uuidv4()
        },
        data: {
            studio_id : studio_uuid
        }
    })

    return response
}

async function checkSubscriptionPayment(studio_uuid, transaction_id) {
    const response = await axios({
        method: 'POST',
        url: `${BE_BASE_URL}owner/funding/subscription/status`,
        headers: {
            'authorization': `Bearer ${token}`,
            'x-device-id': deviceId,
            'x-ip-address': ip,
            'x-request-id': uuidv4()
        },
        data: {
            studio_id : studio_uuid,
            transaction_id
        }
    })

    return response
}

export { listStudio, submission, studioNumberOwner, submitStudioNumber, studioNumberDetail, editStudioNumber, subscriptionPrice, checkQrSubscription, subscribeStudio, checkSubscriptionPayment }