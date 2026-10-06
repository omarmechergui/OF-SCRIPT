import api from '../api';

export const pointsApi = {
  getPoints: async (page = 1) => {
    const response = await api.get(`/points?page=${page}`);
    return response.data;
  }
};
