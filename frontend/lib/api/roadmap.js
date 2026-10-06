import api from '../api';

export const roadmapApi = {
  getRoadmap: async () => {
    const response = await api.get('/roadmap');
    return response.data;
  }
};
