import api from './axiosInstance';

export const fetchChats = async () => {
  const response = await api.get('/chats');
  return response.data;
};

export const accessChat = async (userId) => {
  const response = await api.post('/chats', { userId });
  return response.data;
};

export const createGroupChat = async (groupData) => {
  const response = await api.post('/chats/group', groupData);
  return response.data;
};

export const renameGroup = async (chatId, chatName) => {
  const response = await api.put('/chats/group/rename', { chatId, chatName });
  return response.data;
};

export const addToGroup = async (chatId, userId) => {
  const response = await api.put('/chats/group/add', { chatId, userId });
  return response.data;
};

export const removeFromGroup = async (chatId, userId) => {
  const response = await api.put('/chats/group/remove', { chatId, userId });
  return response.data;
};
