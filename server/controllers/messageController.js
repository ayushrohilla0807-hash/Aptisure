import Message from '../models/Message.js';
import User from '../models/User.js';
import Chat from '../models/Chat.js';

// @desc    Get all messages for a specific chat
// @route   GET /api/messages/:chatId
// @access  Private
export const allMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    if (!chatId) {
      return res.status(400).json({ message: 'ChatId parameter is required' });
    }

    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'username avatar email')
      .populate('chat')
      .sort({ createdAt: 1 });

    return res.json(messages);
  } catch (error) {
    console.error('[Get Messages Error]', error);
    return res.status(500).json({ message: error.message || 'Failed to fetch messages' });
  }
};

// @desc    Create / Send New Message
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.status(400).json({ message: 'Invalid data passed into request body' });
  }

  const newMessage = {
    sender: req.user._id,
    content: content.trim(),
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate('sender', 'username avatar email');
    message = await message.populate('chat');
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'username avatar email',
    });

    // Update the latestMessage field of the Chat document
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });

    return res.status(201).json(message);
  } catch (error) {
    console.error('[Send Message Error]', error);
    return res.status(500).json({ message: error.message || 'Failed to send message' });
  }
};
