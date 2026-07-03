import api from './api';

export const reservationService = {
  createReservation: async (data) => {
    const response = await api.post('/reservations', data);
    return response.data;
  },

  getAllReservations: async () => {
    const response = await api.get('/reservations');
    return response.data;
  },

  getReservationById: async (id) => {
    const response = await api.get(`/reservations/${id}`);
    return response.data;
  },
  getMyHistory: async (ids = []) => {
    const response = await api.post(`/reservations/my-history`, { ids });
    return response.data;
  },

  updateReservationStatus: async (id, status, notes = '') => {
    const response = await api.patch(`/reservations/${id}/status`, { status, notes });
    return response.data;
  },

  uploadPaymentProof: async (id, file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post(`/reservations/${id}/upload-proof`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};
