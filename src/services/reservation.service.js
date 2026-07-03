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

  updateReservationStatus: async (id, status, notes = '') => {
    const response = await api.patch(`/reservations/${id}/status`, { status, notes });
    return response.data;
  }
};
