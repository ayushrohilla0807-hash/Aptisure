import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useSocket } from '../../hooks/useSocket';
import { useChat } from '../../hooks/useChat';

const QUICK_EMOJIS = ['👋', '👍', '❤️', '😊', '🎉', '🔥', '🚀', '✨', '👏', '💯'];

export const MessageInput = ({ onSendMessage }) => {
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();
  const { socket } = useSocket();
  const { selectedChat } = useChat();

  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);
  const inputRef = useRef(null);

  // Focus input when selected chat changes
  useEffect(() => {
    inputRef.current?.focus();
  }, [selectedChat]);

  const handleTyping = (e) => {
    setText(e.target.value);

    if (!socket || !selectedChat) return;

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socket.emit('typing', {
        room: selectedChat._id,
        user: { _id: user._id, username: user.username },
      });
    }

    // Reset typing timer
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop_typing', {
        room: selectedChat._id,
        user: { _id: user._id, username: user.username },
      });
      isTypingRef.current = false;
    }, 2500);
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!text.trim() || isSending) return;

    const messageText = text.trim();
    setText('');
    setIsSending(true);
    setShowEmojiPicker(false);

    // Stop typing immediately
    if (socket && selectedChat && isTypingRef.current) {
      clearTimeout(typingTimeoutRef.current);
      socket.emit('stop_typing', {
        room: selectedChat._id,
        user: { _id: user._id, username: user.username },
      });
      isTypingRef.current = false;
    }

    try {
      await onSendMessage(messageText);
    } catch (err) {
      console.error('Failed to send message:', err);
      // Restore text if failed
      setText(messageText);
    } finally {
      setIsSending(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const addEmoji = (emoji) => {
    setText((prev) => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative p-3 sm:p-4 bg-white border-t border-slate-100">
      {/* Quick Emoji Bar Popover */}
      {showEmojiPicker && (
        <div className="absolute bottom-full mb-2 left-2 sm:left-4 max-w-[calc(100vw-2rem)] sm:max-w-none overflow-x-auto z-20 flex items-center gap-1.5 p-2 bg-white rounded-2xl shadow-stitch-floating border border-slate-200/80 animate-fade-in no-scrollbar">
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => addEmoji(emoji)}
              className="p-1.5 text-lg hover:bg-slate-100 rounded-xl transition-all transform hover:scale-125 flex-shrink-0"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-2xl p-1.5 pl-3 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:bg-white transition-all shadow-stitch-sm"
      >
        {/* Emoji Button */}
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={`p-2 rounded-xl transition-colors ${
            showEmojiPicker
              ? 'text-brand-600 bg-brand-50'
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/60'
          }`}
          title="Add Emoji"
        >
          <Smile size={20} />
        </button>

        {/* Input Text Area */}
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={handleTyping}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 bg-transparent text-slate-800 text-sm focus:outline-none placeholder-slate-400 py-2"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={!text.trim() || isSending}
          className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
            text.trim() && !isSending
              ? 'bg-brand-600 text-white shadow-stitch-sm hover:bg-brand-700 active:scale-95'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
          title="Send Message (Enter)"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
