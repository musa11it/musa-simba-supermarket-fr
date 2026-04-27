import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' },
    });

    // Request: attach token
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('simba_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response: handle 401
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          const path = window.location.pathname;
          if (!path.includes('/login') && !path.includes('/register')) {
            localStorage.removeItem('simba_token');
            localStorage.removeItem('simba_user');
            if (path.includes('/dashboard') || path.includes('/account')) {
              window.location.href = '/login';
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T = any>(url: string, params?: any): Promise<T> {
    const { data } = await this.client.get(url, { params });
    return data;
  }

  async post<T = any>(url: string, body?: any): Promise<T> {
    const { data } = await this.client.post(url, body);
    return data;
  }

  async put<T = any>(url: string, body?: any): Promise<T> {
    const { data } = await this.client.put(url, body);
    return data;
  }

  async delete<T = any>(url: string): Promise<T> {
    const { data } = await this.client.delete(url);
    return data;
  }
}

export const api = new ApiClient();
export default api;