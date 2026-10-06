import api from '../api';

export const badgesApi = {
  getBadges: async () => {
    const response = await api.get('/badges');
    return response.data;
  }
};
