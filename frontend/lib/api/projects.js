import api from '../api';

export const projectsApi = {
  getProjects: async (page = 1) => {
    const response = await api.get(`/projects?page=${page}`);
    return response.data;
  },
  getProject: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },
  startProject: async (id) => {
    const response = await api.patch(`/projects/${id}/progress`, { status: 'IN_PROGRESS' });
    return response.data;
  },
  submitProject: async (id, data) => {
    const response = await api.post(`/projects/${id}/submissions`, data);
    return response.data;
  }
};
