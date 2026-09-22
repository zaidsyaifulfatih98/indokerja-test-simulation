import axios, { AxiosError } from 'axios';
import { mockAdapter } from '../mock/mockServer';

/** SEMENTARA: true = pakai data JSON (src/mock/db.json) tanpa backend. */
const USE_MOCK = true;

const TOKEN_KEY = 'indokerja_token';

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export const http = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL ?? ''}/api`,
  ...(USE_MOCK && { adapter: mockAdapter }),
});

http.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    // Token kedaluwarsa/invalid -> paksa logout (kecuali saat proses login itu sendiri)
    const isAuthRoute = error.config?.url?.startsWith('/auth/login');
    if (error.response?.status === 401 && !isAuthRoute && tokenStorage.get()) {
      tokenStorage.clear();
      window.dispatchEvent(new Event('auth:logout'));
    }
    return Promise.reject(error);
  },
);

interface ApiErrorBody {
  message?: string | string[];
}

/** Ambil pesan error yang ramah dari response backend (NestJS/Express). */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const msg = error.response?.data?.message;
    if (Array.isArray(msg)) return msg.join(', ');
    if (msg) return msg;
    if (!error.response) return 'Tidak dapat terhubung ke server.';
  }
  return 'Terjadi kesalahan. Silakan coba lagi.';
}
