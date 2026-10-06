import api from '../api';

export const sessionsApi = {
  getSession: async (id) => {
    const response = await api.get(`/sessions/${id}`);
    return response.data;
  },
  updateProgress: async (id, data) => {
    const response = await api.patch(`/sessions/${id}/progress`, data);
    return response.data;
  }
};
