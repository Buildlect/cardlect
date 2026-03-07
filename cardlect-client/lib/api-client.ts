import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://cardlect.buildlect.com/latest',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding the auth token
api.interceptors.request.use(
    (config) => {
        const stored = typeof window !== 'undefined' ? localStorage.getItem('cardlect_token') : null;
        const isDevMock = typeof window !== 'undefined' ? localStorage.getItem('cardlect_dev_mock') === '1' : false;
        if (stored && !isDevMock) {
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
                const requestUrl = String(error?.config?.url || '');
                const isAuthAttempt = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/refresh');
                if (isAuthAttempt) {
                    return Promise.reject(error);
                }
                const isDevMock = localStorage.getItem('cardlect_dev_mock') === '1';
                if (isDevMock) {
                    return Promise.reject(error);
                }
                localStorage.removeItem('cardlect_token');
                localStorage.removeItem('cardlect_user');
                localStorage.removeItem('cardlect_dev_mock');
                window.location.href = '/auth/logout';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
