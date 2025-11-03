import axios from "axios";
import { getIpAdresses } from "../../services/axios/ip-adress.services";
import { v4 as uuidv4 } from 'uuid'

export async function fetchStudioNumbers(studio_id) {
    try {
        const BE_BASE_URL = import.meta.env.VITE_STUDIO_BAND_BE_BASE_URL

        const ipAddress = await getIpAdresses()
        const device_id = localStorage.getItem('device_id')

        if (!device_id) {
            throw new Error('Device ID not found')
        }

        const requestId = uuidv4();

        const response = await axios({
            method: 'POST',
            url: `${BE_BASE_URL}user/studio/list/studio-number`,
            data: {
                studio_uuid: studio_id
            },
            headers : {
                'x-ip-address': ipAddress,
                'x-device-id': device_id,
                'x-request-id': requestId
            }
        });

        if (!response.data.status) throw new Error('studio not found');

        const studioList = response.data.data.result;

        let responsePage = []

        for (const studio of studioList) {


            responsePage.push({
                studio_number_uuid: studio.studio_number_uuid,
                studio_uuid : studio.studio_uuid,
                studio_number_id: studio.studio_number_id,
                studio_id : studio.studio_id,
                studio_number: studio.studio_number,
                studio_number_pictures: `${BE_BASE_URL}uploads/${studio.studio_picture}`,
                studio_equipments: studio.studio_equipments,
                studio_prices: studio.studio_prices
            })
        }

        return {
            studios: responsePage,
            studio_name: response.data.data.studio_name
        }

    } catch (error) {
        console.error('Gagal ambil data studio number:', error);
        return [];
    }
}