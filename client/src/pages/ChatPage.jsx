import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { ChatHeader } from '../components/chat/ChatHeader';
import { MessageStream } from '../components/chat/MessageStream';
import { MessageInput } from '../components/chat/MessageInput';
import { EmptyChatState } from '../components/chat/EmptyChatState';
import { NewChatModal } from '../components/chat/NewChatModal';
import { CreateGroupModal } from '../components/chat/CreateGroupModal';
import { ToastNotification } from '../components/notification/ToastNotification';
import { useChat } from '../hooks/useChat';

export const ChatPage = () => {
  const {
    selectedChat,
    setSelectedChat,
    messages,
    loadingMessages,
    sendMessage,
    toastNotification,
    clearToast,
  } = useChat();

  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);

  const handleSelectToastChat = () => {
    if (toastNotification?.chat) {
      setSelectedChat(toastNotification.chat);
      clearToast();
    }
  };

  return (
    <div className="h-[100dvh] h-screen flex flex-col bg-slate-100 overflow-hidden">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Workspace Body */}
      <main className="flex-1 flex overflow-hidden p-0 sm:p-3 sm:pt-0 max-w-[1600px] w-full mx-auto">
        <div className="flex-1 flex bg-white sm:rounded-3xl sm:border sm:border-slate-200/80 sm:shadow-stitch overflow-hidden relative">
          {/* Responsive Sidebar (List of Conversations) */}
          <Sidebar
            onOpenNewChat={() => setShowNewChatModal(true)}
            onOpenGroupModal={() => setShowGroupModal(true)}
          />

          {/* Active Chat Conversation Area OR Empty Placeholder */}
          {selectedChat ? (
            <section className="flex-1 flex flex-col h-full bg-slate-50/30 overflow-hidden">
              <ChatHeader
                chat={selectedChat}
                onBack={() => setSelectedChat(null)}
              />

              <MessageStream
                messages={messages}
                isGroup={selectedChat.isGroupChat}
                loading={loadingMessages}
              />

              <MessageInput onSendMessage={sendMessage} />
            </section>
          ) : (
            <EmptyChatState
              onOpenNewChat={() => setShowNewChatModal(true)}
              onOpenGroupModal={() => setShowGroupModal(true)}
            />
          )}
        </div>
      </main>

      {/* Modals */}
      <NewChatModal
        isOpen={showNewChatModal}
        onClose={() => setShowNewChatModal(false)}
      />

      <CreateGroupModal
        isOpen={showGroupModal}
        onClose={() => setShowGroupModal(false)}
      />

      {/* In-app Toast for background messages */}
      <ToastNotification
        message={toastNotification}
        onClose={clearToast}
        onClick={handleSelectToastChat}
      />
    </div>
  );
};
