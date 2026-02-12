//  FRONTEND: Cart.jsx
// await api.post('/orders', {
//     items: orderItems,
//     totalPrice,
//     delivery_address: deliveryAddress,
//     phone: phone
// });

// ↓ VITE PROXY REDIRECTS
// FROM: http://localhost:5173/api/orders
// TO:   http://localhost:5000/api/orders

//  BACKEND: server.js receives request
// POST /api/orders
// Headers: {
//     'Content-Type': 'application/json',
//     'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIs...'
// }
// Body: {
//     "items": [...],
//     "totalPrice": 31.98,
//     "delivery_address": "123 Main St",
//     "phone": "555-1234"
// }


import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Proxy will handle this to localhost:5000 // all request go to /api
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Auto logout if 401? Maybe just reject for now.
            // localStorage.removeItem('token');
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
