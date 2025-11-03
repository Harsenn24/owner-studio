import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { getIpAdresses } from "../../services/axios/ip-adress.services";


export async function fetchMyBookings() {
    try {
        const BE_BASE_URL = import.meta.env.VITE_STUDIO_BAND_BE_BASE_URL
        const token = localStorage.getItem('token')
        if (!token) {
            alert('login terlebih dahulu')
            router.push('/login')
            return
        }

        const ipAddress = await getIpAdresses();


        const response = await axios({
            method: 'POST',
            url: `${BE_BASE_URL}user/book/list/`,
            data: {
                "page": 1,
                "limit": 10000000
            },
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-ip-address': ipAddress,
                'x-request-id': uuidv4(),
                'x-device-id': localStorage.getItem('device_id')
            }
        });

        if (!response.data.status) throw new Error('unauthorized');

        const myBooking = response.data.data;
                
        return myBooking

    } catch (error) {
        console.error('Gagal ambil data studio:', error);
        return [];
    }
}