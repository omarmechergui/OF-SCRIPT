import api from '../api';

export const dashboardApi = {
  getDashboard: async () => {
    const response = await api.get('/dashboard');
    return response.data;
  }
};
