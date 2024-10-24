import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_URL_API_PROD
        : process.env.NEXT_PUBLIC_URL_API_DEV
});

export default api;