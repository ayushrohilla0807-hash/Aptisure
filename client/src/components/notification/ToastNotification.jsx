import React, { useEffect } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { Avatar } from '../common/Avatar';

export const ToastNotification = ({ message, onClose, onClick }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      onClick={onClick}
      className="fixed bottom-5 right-5 z-50 flex items-center gap-3 p-3.5 max-w-sm bg-white rounded-2xl shadow-stitch-floating border border-slate-200/80 cursor-pointer hover:border-brand-300 transition-all transform hover:-translate-y-0.5 animate-bounce-subtle"
    >
      <Avatar
        src={message.sender?.avatar}
        name={message.sender?.username}
        size="md"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-800 truncate">
            {message.sender?.username}
          </span>
          {message.chat?.isGroupChat && (
            <span className="text-[10px] text-brand-600 bg-brand-50 font-medium px-1.5 py-0.5 rounded-full">
              {message.chat.chatName}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-600 truncate mt-0.5">{message.content}</p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};
