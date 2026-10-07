import React, { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { MessageSkeleton } from '../common/Loader';
import { formatDateDivider } from '../../utils/helpers';
import { useChat } from '../../hooks/useChat';
import { Sparkles } from 'lucide-react';

export const MessageStream = ({ messages, isGroup, loading }) => {
  const { selectedChat, typingInRoom } = useChat();
  const bottomRef = useRef(null);

  // Auto-scroll to bottom on new message or chat select
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingInRoom]);

  const currentTypingUsers = selectedChat?._id
    ? typingInRoom[selectedChat._id] || []
    : [];

  if (loading) {
    return <MessageSkeleton />;
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400">
        <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center mb-3 shadow-stitch-sm">
          <Sparkles size={24} />
        </div>
        <h4 className="text-base font-semibold text-slate-700">No messages here yet</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-xs">
          Send a warm hello to start this real-time conversation!
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-1">
      {messages.map((message, index) => {
        // Date divider check
        const prevMessage = messages[index - 1];
        const showDateDivider =
          !prevMessage ||
          new Date(prevMessage.createdAt).toDateString() !==
            new Date(message.createdAt).toDateString();

        // Check if next message is from same sender (to suppress repeated avatar)
        const nextMessage = messages[index + 1];
        const isLastFromSender =
          !nextMessage || nextMessage.sender?._id !== message.sender?._id;

        return (
          <React.Fragment key={message._id || index}>
            {showDateDivider && (
              <div className="flex items-center justify-center my-4">
                <span className="px-3 py-1 bg-slate-100/90 text-slate-500 text-[11px] font-medium rounded-full border border-slate-200/50 select-none shadow-stitch-sm">
                  {formatDateDivider(message.createdAt)}
                </span>
              </div>
            )}
            <MessageBubble
              message={message}
              isGroup={isGroup}
              showAvatar={isLastFromSender}
            />
          </React.Fragment>
        );
      })}

      {/* Typing Indicator */}
      <TypingIndicator typingUsers={currentTypingUsers} />

      <div ref={bottomRef} />
    </div>
  );
};
