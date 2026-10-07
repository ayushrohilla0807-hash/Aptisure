import React from 'react';
import { ConversationItem } from './ConversationItem';
import { Loader } from '../common/Loader';
import { MessageSquareDashed } from 'lucide-react';
import { useChat } from '../../hooks/useChat';

export const ConversationList = ({ chats, filter = 'all', searchQuery = '' }) => {
  const { selectedChat, setSelectedChat, notifications, loadingChats } = useChat();

  // Filter chats by tab (all / direct / group) & search query
  const filteredChats = chats.filter((chat) => {
    // 1. Tab filter
    if (filter === 'direct' && chat.isGroupChat) return false;
    if (filter === 'groups' && !chat.isGroupChat) return false;

    // 2. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (chat.isGroupChat) {
        return chat.chatName?.toLowerCase().includes(q);
      } else {
        return chat.users?.some((u) => u.username?.toLowerCase().includes(q));
      }
    }

    return true;
  });

  if (loadingChats && chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400">
        <Loader size="md" />
        <span className="text-xs mt-3">Loading conversations...</span>
      </div>
    );
  }

  if (filteredChats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
          <MessageSquareDashed size={22} />
        </div>
        <p className="text-sm font-medium text-slate-600">No conversations found</p>
        <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
          {searchQuery
            ? 'Try searching for a different name or email'
            : 'Start a new conversation or create a group room'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-1.5 p-2 overflow-y-auto">
      {filteredChats.map((chat) => {
        // Calculate unread notifications count for this chat
        const unreadCount = notifications.filter(
          (n) => n.chat?._id === chat._id
        ).length;

        return (
          <ConversationItem
            key={chat._id}
            chat={chat}
            isSelected={selectedChat?._id === chat._id}
            onClick={() => setSelectedChat(chat)}
            unreadCount={unreadCount}
          />
        );
      })}
    </div>
  );
};
