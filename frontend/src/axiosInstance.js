import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
});

export default axiosInstance;
