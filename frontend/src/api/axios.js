import axios from 'axios';
import config from '../config'; 

// 1. Ek centralized Axios instance banaya
const api = axios.create({
    baseURL: config.API_BASE_URL, // Tera backend URL (jaise http://localhost:5000/api)
    withCredentials: true         // 🔥 HTTPOnly Cookies (Refresh Token) bhejne aur receive karne ke liye zaroori hai
});

// 2. 🛡️ REQUEST INTERCEPTOR: Har API request backend pe jaane se theek pehle yahan se guzregi
api.interceptors.request.use(
    (requestConfig) => {
        // LocalStorage se apna Access Token nikal
        const token = localStorage.getItem('accessToken');
        
        // Agar token mil gaya, toh usko request ke 'Authorization' header mein chipka de
        if (token) {
            requestConfig.headers.Authorization = `Bearer ${token}`;
        }
        
        return requestConfig;
    }, 
    (error) => {
        // Agar request banne mein koi error aaye toh reject kar do
        return Promise.reject(error);
    }
);

// 3. 🛡️ RESPONSE INTERCEPTOR: Har API response backend se aane ke baad yahan se guzregi
// Isko abhi ke liye aise hi chhod de, baad mein jab Refresh Token flow banayenge tab isme logic dalenge
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Agar backend bolta hai 401 Unauthorized (Token expire/invalid)
        if (error.response && error.response.status === 401) {
            console.warn("Token expired or invalid. Redirecting to login...");
            // Yahan hum chahein toh user ko auto-logout karke login page pe bhej sakte hain
            // localStorage.removeItem('accessToken');
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
