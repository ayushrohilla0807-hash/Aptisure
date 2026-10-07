import User from '../models/User.js';

// @desc    Get or search all users (except logged in user)
// @route   GET /api/users?search=
// @access  Private
export const allUsers = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { username: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } },
          ],
        }
      : {};

    // Exclude current user from search result
    const users = await User.find(keyword)
      .find({ _id: { $ne: req.user._id } })
      .select('-password');

    return res.json(users);
  } catch (error) {
    console.error('[Search Users Error]', error);
    return res.status(500).json({ message: error.message || 'Failed to fetch users' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.username = req.body.username || user.username;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.avatar = req.body.avatar || user.avatar;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      return res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
      });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('[Update Profile Error]', error);
    return res.status(500).json({ message: error.message || 'Failed to update profile' });
  }
};
