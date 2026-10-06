import api from '../api';

export const competitionsApi = {
  getCompetitions: async (page = 1) => {
    const response = await api.get(`/competitions?page=${page}`);
    return response.data;
  },
  getCompetition: async (id) => {
    const response = await api.get(`/competitions/${id}`);
    return response.data;
  },
  register: async (id) => {
    const response = await api.post(`/competitions/${id}/register`);
    return response.data;
  },
  cancelRegistration: async (id) => {
    const response = await api.delete(`/competitions/${id}/register`);
    return response.data;
  },
  submitEntry: async (id, data) => {
    const response = await api.post(`/competitions/${id}/submissions`, data);
    return response.data;
  }
};
