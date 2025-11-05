import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Ensure Authorization header is attached from localStorage on each request
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      if (!config.headers) config.headers = {} as any;
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore when localStorage is not available (SSR)
  }
  return config;
});
