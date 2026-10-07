import api from './axiosInstance';

export const fetchMessages = async (chatId) => {
  const response = await api.get(`/messages/${chatId}`);
  return response.data;
};

export const sendMessage = async (messageData) => {
  const response = await api.post('/messages', messageData);
  return response.data;
};
