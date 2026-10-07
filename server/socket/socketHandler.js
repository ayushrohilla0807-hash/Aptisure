import User from '../models/User.js';

// In-memory map to track active user socket connections: userId -> Set(socketIds)
const activeUsers = new Map();

export const initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket.IO] New connection established: ${socket.id}`);

    let currentUserId = null;

    // 1. User Setup & Authentication Registration
    socket.on('setup', async (userData) => {
      if (!userData || !userData._id) return;

      currentUserId = userData._id.toString();
      socket.join(currentUserId);
      console.log(`[Socket.IO] User registered: ${userData.username} (${currentUserId}) -> Socket: ${socket.id}`);

      // Track active socket
      if (!activeUsers.has(currentUserId)) {
        activeUsers.set(currentUserId, new Set());
      }
      activeUsers.get(currentUserId).add(socket.id);

      // Update user presence in DB
      try {
        await User.findByIdAndUpdate(currentUserId, {
          isOnline: true,
          lastSeen: new Date(),
        });
      } catch (err) {
        console.error('[Socket.IO] Error updating online status:', err.message);
      }

      socket.emit('connected');

      // Broadcast list of currently online user IDs to all clients
      io.emit('online_users', Array.from(activeUsers.keys()));
    });

    // 2. Joining a Chat Room
    socket.on('join_chat', (room) => {
      if (!room) return;
      socket.join(room);
      console.log(`[Socket.IO] Socket ${socket.id} joined chat room: ${room}`);
    });

    // 3. Leaving a Chat Room
    socket.on('leave_chat', (room) => {
      if (!room) return;
      socket.leave(room);
      console.log(`[Socket.IO] Socket ${socket.id} left chat room: ${room}`);
    });

    // 4. Typing Indicators
    socket.on('typing', ({ room, user }) => {
      if (!room) return;
      socket.to(room).emit('display_typing', { room, user });
    });

    socket.on('stop_typing', ({ room, user }) => {
      if (!room) return;
      socket.to(room).emit('stop_display_typing', { room, user });
    });

    // 5. New Message Broadcast
    socket.on('new_message', (newMessageReceived) => {
      const chat = newMessageReceived.chat;

      if (!chat || !chat.users) {
        console.warn('[Socket.IO] Chat or chat.users not defined on message payload');
        return;
      }

      // Broadcast to specific chat room
      socket.to(chat._id).emit('message_received', newMessageReceived);

      // Also deliver notifications to user-specific rooms for members not currently in the chat room
      chat.users.forEach((user) => {
        const userId = typeof user === 'object' ? user._id.toString() : user.toString();
        const senderId = typeof newMessageReceived.sender === 'object'
          ? newMessageReceived.sender._id.toString()
          : newMessageReceived.sender.toString();

        if (userId === senderId) return;

        // Emit to the user's private socket room for background notifications & unread badges
        socket.to(userId).emit('message_notification', newMessageReceived);
      });
    });

    // 6. User Disconnect
    socket.on('disconnect', async () => {
      console.log(`[Socket.IO] Socket disconnected: ${socket.id}`);

      if (currentUserId && activeUsers.has(currentUserId)) {
        const userSockets = activeUsers.get(currentUserId);
        userSockets.delete(socket.id);

        if (userSockets.size === 0) {
          activeUsers.delete(currentUserId);

          try {
            await User.findByIdAndUpdate(currentUserId, {
              isOnline: false,
              lastSeen: new Date(),
            });
          } catch (err) {
            console.error('[Socket.IO] Error updating offline status:', err.message);
          }
        }

        // Broadcast updated list of online users
        io.emit('online_users', Array.from(activeUsers.keys()));
      }
    });
  });
};
