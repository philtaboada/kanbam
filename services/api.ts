import axios from 'axios';

console.log('process.env.NODE_ENV', process.env.NODE_ENV);
console.log('URL_API_DEV:', process.env.NEXT_PUBLIC_URL_API_DEV);
console.log('URL_API_PROD:', process.env.NEXT_PUBLIC_URL_API_PROD);
const api = axios.create({
    baseURL: process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_URL_API_PROD
        : process.env.NEXT_PUBLIC_URL_API_DEV
});

export default api;