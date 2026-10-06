import api from '../index';

export const adminApi = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },
  
  getUsers: async (page = 1, limit = 20) => {
    const response = await api.get(`/admin/users?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  getUser: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },
  
  updateUser: async (id, data) => {
    const response = await api.patch(`/admin/users/${id}`, data);
    return response.data;
  },
  
  getProjects: async (page = 1, limit = 20) => {
    const response = await api.get(`/admin/projects?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  createProject: async (data) => {
    const response = await api.post('/admin/projects', data);
    return response.data;
  },
  
  updateProject: async (id, data) => {
    const response = await api.patch(`/admin/projects/${id}`, data);
    return response.data;
  },
  
  deleteProject: async (id) => {
    const response = await api.delete(`/admin/projects/${id}`);
    return response.data;
  },
  
  getCompetitions: async (page = 1, limit = 20) => {
    const response = await api.get(`/admin/competitions?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  createCompetition: async (data) => {
    const response = await api.post('/admin/competitions', data);
    return response.data;
  },
  
  updateCompetition: async (id, data) => {
    const response = await api.patch(`/admin/competitions/${id}`, data);
    return response.data;
  },
  
  deleteCompetition: async (id) => {
    const response = await api.delete(`/admin/competitions/${id}`);
    return response.data;
  },
  
  getBadges: async () => {
    const response = await api.get('/admin/badges');
    return response.data;
  },
  
  createBadge: async (data) => {
    const response = await api.post('/admin/badges', data);
    return response.data;
  },
  
  updateBadge: async (id, data) => {
    const response = await api.patch(`/admin/badges/${id}`, data);
    return response.data;
  },
  
  getRewardRules: async () => {
    const response = await api.get('/admin/rewards');
    return response.data;
  },
  
  createRewardRule: async (data) => {
    const response = await api.post('/admin/rewards', data);
    return response.data;
  },
  
  updateRewardRule: async (id, data) => {
    const response = await api.patch(`/admin/rewards/${id}`, data);
    return response.data;
  },
  
  adjustPoints: async (data) => {
    const response = await api.post('/admin/points/adjust', data);
    return response.data;
  },
  
  getAuditLogs: async (page = 1, limit = 20) => {
    const response = await api.get(`/admin/audit-logs?page=${page}&limit=${limit}`);
    return response.data;
  }
};
