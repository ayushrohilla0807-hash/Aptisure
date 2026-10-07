import React from 'react';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { Users } from 'lucide-react';
import { formatTime, getSender, getSenderFull } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';
import { useSocket } from '../../hooks/useSocket';

export const ConversationItem = ({
  chat,
  isSelected,
  onClick,
  unreadCount = 0,
}) => {
  const { user } = useAuth();
  const { isUserOnline } = useSocket();

  const isGroup = chat.isGroupChat;
  const otherUser = !isGroup ? getSenderFull(user, chat.users) : null;
  const isOnline = otherUser ? isUserOnline(otherUser._id) : false;

  const chatTitle = isGroup ? chat.chatName : getSender(user, chat.users);
  const avatarSrc = isGroup ? chat.groupIcon : otherUser?.avatar;

  const latestMsg = chat.latestMessage;
  const senderPrefix = latestMsg
    ? latestMsg.sender?._id === user?._id
      ? 'You: '
      : isGroup
      ? `${latestMsg.sender?.username?.split(' ')[0]}: `
      : ''
    : '';

  return (
    <div
      onClick={onClick}
      className={`group relative flex items-center gap-3.5 p-3.5 rounded-2xl cursor-pointer transition-all duration-150 ${
        isSelected
          ? 'bg-brand-50/80 border border-brand-200/80 shadow-stitch-sm'
          : 'hover:bg-slate-100/80 border border-transparent'
      }`}
    >
      {/* Avatar */}
      <div className="relative">
        {isGroup ? (
          avatarSrc ? (
            <Avatar src={avatarSrc} name={chatTitle} size="md" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center shadow-stitch-sm">
              <Users size={18} />
            </div>
          )
        ) : (
          <Avatar
            src={avatarSrc}
            name={chatTitle}
            size="md"
            showStatus={true}
            isOnline={isOnline}
          />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-1">
          <h4
            className={`text-sm font-semibold truncate ${
              isSelected ? 'text-brand-950' : 'text-slate-800'
            }`}
          >
            {chatTitle}
          </h4>
          {latestMsg && (
            <span
              className={`text-[11px] flex-shrink-0 ${
                unreadCount > 0
                  ? 'text-brand-600 font-semibold'
                  : 'text-slate-400'
              }`}
            >
              {formatTime(latestMsg.createdAt || chat.updatedAt)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <p
            className={`text-xs truncate ${
              unreadCount > 0
                ? 'font-semibold text-slate-900'
                : isSelected
                ? 'text-brand-800/80'
                : 'text-slate-500'
            }`}
          >
            {latestMsg ? (
              <>
                <span className="text-slate-400 font-normal">{senderPrefix}</span>
                {latestMsg.content}
              </>
            ) : (
              <span className="italic text-slate-400">No messages yet</span>
            )}
          </p>

          {unreadCount > 0 && (
            <Badge count={unreadCount} variant="brand" />
          )}
        </div>
      </div>
    </div>
  );
};
