import Chat from '../models/Chat.js';
import User from '../models/User.js';

// @desc    Create or access 1-on-1 Chat
// @route   POST /api/chats
// @access  Private
export const accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'UserId param not sent with request' });
  }

  if (userId === req.user._id.toString()) {
    return res.status(400).json({ message: 'Cannot create a 1-on-1 chat with yourself' });
  }

  try {
    // Check if 1-on-1 chat already exists between both users
    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate('users', '-password')
      .populate('latestMessage');

    isChat = await User.populate(isChat, {
      path: 'latestMessage.sender',
      select: 'username avatar email',
    });

    if (isChat.length > 0) {
      return res.json(isChat[0]);
    } else {
      // Create a new 1-on-1 chat
      const chatData = {
        chatName: 'sender',
        isGroupChat: false,
        users: [req.user._id, userId],
      };

      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        'users',
        '-password'
      );
      return res.status(201).json(fullChat);
    }
  } catch (error) {
    console.error('[Access Chat Error]', error);
    return res.status(500).json({ message: error.message || 'Failed to access chat' });
  }
};

// @desc    Fetch all chats for the logged in user
// @route   GET /api/chats
// @access  Private
export const fetchChats = async (req, res) => {
  try {
    let results = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 });

    results = await User.populate(results, {
      path: 'latestMessage.sender',
      select: 'username avatar email',
    });

    return res.json(results);
  } catch (error) {
    console.error('[Fetch Chats Error]', error);
    return res.status(500).json({ message: error.message || 'Failed to fetch conversations' });
  }
};

// @desc    Create new Group Chat
// @route   POST /api/chats/group
// @access  Private
export const createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).json({ message: 'Please provide group name and participants' });
  }

  let users = req.body.users;
  if (typeof users === 'string') {
    try {
      users = JSON.parse(users);
    } catch {
      return res.status(400).json({ message: 'Invalid users array format' });
    }
  }

  // Ensure creator is included
  const creatorId = req.user._id.toString();
  const stringifiedUsers = users.map((u) => (typeof u === 'object' ? u.toString() : u));
  if (!stringifiedUsers.includes(creatorId)) {
    users.push(req.user._id);
  }

  if (users.length < 2) {
    return res.status(400).json({
      message: 'At least 2 users are required to form a group chat',
    });
  }

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name.trim(),
      users: users,
      isGroupChat: true,
      groupAdmin: req.user._id,
      groupIcon: req.body.groupIcon || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(req.body.name)}`,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    return res.status(201).json(fullGroupChat);
  } catch (error) {
    console.error('[Create Group Error]', error);
    return res.status(500).json({ message: error.message || 'Failed to create group' });
  }
};

// @desc    Rename Group Chat
// @route   PUT /api/chats/group/rename
// @access  Private
export const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  if (!chatId || !chatName) {
    return res.status(400).json({ message: 'Please provide chatId and new chatName' });
  }

  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName: chatName.trim() },
      { new: true }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!updatedChat) {
      return res.status(404).json({ message: 'Chat Not Found' });
    }

    return res.json(updatedChat);
  } catch (error) {
    console.error('[Rename Group Error]', error);
    return res.status(500).json({ message: error.message || 'Failed to rename group' });
  }
};

// @desc    Add user to Group
// @route   PUT /api/chats/group/add
// @access  Private
export const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  if (!chatId || !userId) {
    return res.status(400).json({ message: 'Please provide chatId and userId to add' });
  }

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user already in group
    if (chat.users.includes(userId)) {
      return res.status(400).json({ message: 'User already in group' });
    }

    const added = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    return res.json(added);
  } catch (error) {
    console.error('[Add to Group Error]', error);
    return res.status(500).json({ message: error.message || 'Failed to add user to group' });
  }
};

// @desc    Remove user from Group
// @route   PUT /api/chats/group/remove
// @access  Private
export const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  if (!chatId || !userId) {
    return res.status(400).json({ message: 'Please provide chatId and userId to remove' });
  }

  try {
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!removed) {
      return res.status(404).json({ message: 'Chat Not Found' });
    }

    return res.json(removed);
  } catch (error) {
    console.error('[Remove from Group Error]', error);
    return res.status(500).json({ message: error.message || 'Failed to remove user from group' });
  }
};
