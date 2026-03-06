import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding the auth token
api.interceptors.request.use(
    (config) => {
        const stored = typeof window !== 'undefined' ? localStorage.getItem('cardlect_token') : null;
        if (stored) {
            config.headers.Authorization = `Bearer ${stored}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling 401s
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('cardlect_token');
                localStorage.removeItem('cardlect_user');
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
