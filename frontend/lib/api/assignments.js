import api from '../api';

export const assignmentsApi = {
  getAssignments: async () => {
    const response = await api.get('/assignments');
    return response.data;
  },
  getAssignment: async (id) => {
    const response = await api.get(`/assignments/${id}`);
    return response.data;
  },
  submitAssignment: async (id, data) => {
    const response = await api.post(`/assignments/${id}/submissions`, data);
    return response.data;
  }
};
