import api from './axiosInstance';

export const searchUsers = async (keyword = '') => {
  const response = await api.get(`/users?search=${encodeURIComponent(keyword)}`);
  return response.data;
};

export const updateProfile = async (userData) => {
  const response = await api.put('/users/profile', userData);
  return response.data;
};
