import axios from "axios";

export async function fetchStudios() {
    try {
        const BE_BASE_URL = import.meta.env.VITE_STUDIO_BAND_BE_BASE_URL

        const response = await axios({
            method: 'POST',
            url: `${BE_BASE_URL}user/studio/list/`,
            data: {
                "page": 1,
                "limit": 10000000
            }
        });

        if (!response.data.status) throw new Error('studio not found');

        const studioList = response.data.data.data;


        let responsePage = []

        for (const studio of studioList) {


            responsePage.push({
                id: studio.studio_uuid,
                name: studio.studio_name,
                image_url: `${BE_BASE_URL}uploads/${studio.studio_picture}`,
                location: `${studio.studio_district}, ${studio.studio_city}`,
                price: studio.studio_start_price,
                maps_url: studio.studio_gmaps,
            })
        }

        return {
            studios: responsePage,
            total: response.data.data.totalData,
            limit: response.data.data.limit
        }

    } catch (error) {
        console.error('Gagal ambil data studio:', error);
        return [];
    }
}