// Format date/timestamp for chat messages and previews
export const formatTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatDateDivider = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    });
  }
};

// Get the display name of a chat (For 1-on-1, return the other user's name; For group, return group name)
export const getSender = (loggedUser, users) => {
  if (!users || users.length < 2) return 'Unknown User';
  const otherUser = users[0]._id === loggedUser?._id ? users[1] : users[0];
  return otherUser?.username || 'Unknown';
};

// Get the full sender object for 1-on-1 chat
export const getSenderFull = (loggedUser, users) => {
  if (!users || users.length < 2) return null;
  return users[0]._id === loggedUser?._id ? users[1] : users[0];
};

// Get initials from a name
export const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};
