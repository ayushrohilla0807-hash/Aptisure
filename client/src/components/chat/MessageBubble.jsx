import React from 'react';
import { Avatar } from '../common/Avatar';
import { formatTime } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';

export const MessageBubble = ({
  message,
  isGroup = false,
  showAvatar = true,
}) => {
  const { user } = useAuth();
  const isMe = message.sender?._id === user?._id;

  return (
    <div
      className={`flex items-end gap-2 group mb-2.5 ${
        isMe ? 'justify-end' : 'justify-start'
      }`}
    >
      {/* Sender Avatar (only for other users and when showAvatar is true) */}
      {!isMe && (
        <div className="w-7 h-7 flex-shrink-0">
          {showAvatar ? (
            <Avatar
              src={message.sender?.avatar}
              name={message.sender?.username}
              size="sm"
            />
          ) : (
            <div className="w-7" />
          )}
        </div>
      )}

      {/* Bubble Container */}
      <div
        className={`relative max-w-[85%] sm:max-w-[75%] md:max-w-[65%] flex flex-col ${
          isMe ? 'items-end' : 'items-start'
        }`}
      >
        {/* Sender Name for Group Chats */}
        {isGroup && !isMe && showAvatar && (
          <span className="text-[11px] font-medium text-slate-500 mb-1 ml-1">
            {message.sender?.username}
          </span>
        )}

        {/* Text Message Bubble */}
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words shadow-stitch-sm ${
            isMe
              ? 'bg-brand-600 text-white rounded-br-xs'
              : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>

          <div
            className={`flex items-center justify-end gap-1 mt-1 text-[10px] select-none ${
              isMe ? 'text-brand-100' : 'text-slate-400'
            }`}
          >
            <span>{formatTime(message.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
