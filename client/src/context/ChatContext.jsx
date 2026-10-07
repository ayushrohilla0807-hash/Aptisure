import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { SocketContext } from './SocketContext';
import * as chatService from '../api/chatService';
import * as messageService from '../api/messageService';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingChats, setLoadingChats] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [typingInRoom, setTypingInRoom] = useState({}); // { [chatId]: [username1, ...] }
  const [toastNotification, setToastNotification] = useState(null);

  // Load all user chats
  const loadChats = useCallback(async () => {
    if (!user) return;
    setLoadingChats(true);
    try {
      const data = await chatService.fetchChats();
      setChats(data);
    } catch (error) {
      console.error('Failed to load conversations', error);
    } finally {
      setLoadingChats(false);
    }
  }, [user]);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  // Load messages whenever selectedChat changes
  useEffect(() => {
    if (!selectedChat?._id) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      setLoadingMessages(true);
      try {
        const data = await messageService.fetchMessages(selectedChat._id);
        setMessages(data);

        // Join socket room
        if (socket) {
          socket.emit('join_chat', selectedChat._id);
        }

        // Remove notifications for this chat
        setNotifications((prev) =>
          prev.filter((n) => n.chat?._id !== selectedChat._id)
        );
      } catch (error) {
        console.error('Failed to fetch messages for chat', error);
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();

    return () => {
      if (socket && selectedChat?._id) {
        socket.emit('leave_chat', selectedChat._id);
      }
    };
  }, [selectedChat, socket]);

  // Socket event listeners for real-time messages, notifications & typing indicators
  useEffect(() => {
    if (!socket) return;

    // Handle incoming message in active room
    const handleMessageReceived = (newMessage) => {
      if (!selectedChat || selectedChat._id !== newMessage.chat._id) {
        // Handled via notification
      } else {
        setMessages((prev) => {
          // Avoid duplicate messages
          if (prev.some((m) => m._id === newMessage._id)) return prev;
          return [...prev, newMessage];
        });
      }

      // Update latest message in chats list
      setChats((prevChats) => {
        const updated = prevChats.map((c) => {
          if (c._id === newMessage.chat._id) {
            return { ...c, latestMessage: newMessage, updatedAt: new Date().toISOString() };
          }
          return c;
        });
        // Sort with most recent on top
        return updated.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      });
    };

    // Handle message notification when not in room
    const handleMessageNotification = (newMessage) => {
      if (!selectedChat || selectedChat._id !== newMessage.chat._id) {
        setNotifications((prev) => {
          if (prev.some((n) => n._id === newMessage._id)) return prev;
          return [newMessage, ...prev];
        });

        // Trigger in-app Toast preview
        setToastNotification(newMessage);
      }
    };

    // Handle typing events
    const handleDisplayTyping = ({ room, user: typingUser }) => {
      setTypingInRoom((prev) => {
        const currentList = prev[room] || [];
        if (!currentList.includes(typingUser.username)) {
          return { ...prev, [room]: [...currentList, typingUser.username] };
        }
        return prev;
      });
    };

    const handleStopDisplayTyping = ({ room, user: typingUser }) => {
      setTypingInRoom((prev) => {
        const currentList = prev[room] || [];
        return {
          ...prev,
          [room]: currentList.filter((name) => name !== typingUser.username),
        };
      });
    };

    socket.on('message_received', handleMessageReceived);
    socket.on('message_notification', handleMessageNotification);
    socket.on('display_typing', handleDisplayTyping);
    socket.on('stop_display_typing', handleStopDisplayTyping);

    return () => {
      socket.off('message_received', handleMessageReceived);
      socket.off('message_notification', handleMessageNotification);
      socket.off('display_typing', handleDisplayTyping);
      socket.off('stop_display_typing', handleStopDisplayTyping);
    };
  }, [socket, selectedChat]);

  // Send a message
  const sendMessage = async (content) => {
    if (!selectedChat || !content.trim()) return;

    try {
      const sentMessage = await messageService.sendMessage({
        chatId: selectedChat._id,
        content: content.trim(),
      });

      // Emit to socket
      if (socket) {
        socket.emit('new_message', sentMessage);
      }

      setMessages((prev) => [...prev, sentMessage]);

      // Update latest message in chats list
      setChats((prevChats) => {
        const updated = prevChats.map((c) => {
          if (c._id === selectedChat._id) {
            return { ...c, latestMessage: sentMessage, updatedAt: new Date().toISOString() };
          }
          return c;
        });
        return updated.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      });

      return sentMessage;
    } catch (error) {
      console.error('Failed to send message', error);
      throw error;
    }
  };

  // Select or create 1-on-1 chat with another user
  const accessOrCreateChat = async (targetUserId) => {
    try {
      const chat = await chatService.accessChat(targetUserId);
      if (!chats.some((c) => c._id === chat._id)) {
        setChats([chat, ...chats]);
      }
      setSelectedChat(chat);
      return chat;
    } catch (error) {
      console.error('Failed to access or create chat', error);
      throw error;
    }
  };

  // Create new group chat
  const createGroup = async (groupName, userIds) => {
    try {
      const newGroup = await chatService.createGroupChat({
        name: groupName,
        users: userIds,
      });
      setChats([newGroup, ...chats]);
      setSelectedChat(newGroup);
      return newGroup;
    } catch (error) {
      console.error('Failed to create group', error);
      throw error;
    }
  };

  const clearToast = () => setToastNotification(null);

  return (
    <ChatContext.Provider
      value={{
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        messages,
        loadingMessages,
        loadingChats,
        loadChats,
        notifications,
        setNotifications,
        typingInRoom,
        toastNotification,
        clearToast,
        sendMessage,
        accessOrCreateChat,
        createGroup,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
