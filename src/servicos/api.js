import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// Função legacy para compatibilidade
export async function buscarJSON(url, opcoes) {
  try {
    const response = await api({
      url,
      method: opcoes?.method || 'GET',
      data: opcoes?.body ? JSON.parse(opcoes.body) : undefined,
      headers: opcoes?.headers
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}
