import React from 'react';

export const TypingIndicator = ({ typingUsers = [] }) => {
  if (!typingUsers || typingUsers.length === 0) return null;

  const displayText =
    typingUsers.length === 1
      ? `${typingUsers[0]} is typing...`
      : `${typingUsers.join(', ')} are typing...`;

  return (
    <div className="flex items-center gap-2 px-4 py-2 text-xs text-slate-500 animate-fade-in">
      <div className="flex items-center gap-1 bg-white border border-slate-200/80 px-3 py-1.5 rounded-full shadow-stitch-sm">
        <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce"></span>
        <span className="ml-1 text-[11px] font-medium text-slate-600">{displayText}</span>
      </div>
    </div>
  );
};
