import axios from 'axios';

const api = axios.create({
    baseURL: process.env.URL_API_PROD
    //baseURL: 'http://localhost:3000/api'
});

export default api;