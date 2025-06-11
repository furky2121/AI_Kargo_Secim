import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Kargo API
export const kargoAPI = {
  getAll: () => api.get('/kargolar'),
  getById: (id) => api.get(`/kargolar/${id}`),
  create: (data) => api.post('/kargolar', data),
  update: (id, data) => api.put(`/kargolar/${id}`, data),
  delete: (id) => api.delete(`/kargolar/${id}`),
};

// Sipariş API
export const siparisAPI = {
  getAll: () => api.get('/siparisler'),
  getById: (id) => api.get(`/siparisler/${id}`),
  create: (data) => api.post('/siparisler', data),
  selectKargo: (id) => api.post(`/siparisler/${id}/kargo-sec`),
  updateStatus: (id, status) => api.put(`/siparisler/${id}/durum`, JSON.stringify(status), {
    headers: { 'Content-Type': 'application/json' }
  }),
  getStatistics: () => api.get('/siparisler/istatistikler'),
};

// İl/İlçe API
export const ilIlceAPI = {
  getIller: () => api.get('/ililce/iller'),
  getIlceler: (ilId) => api.get(`/ililce/ilceler/${ilId}`),
};

export default api;
