import React, { useState } from 'react';
import { ArrowLeft, MoreVertical, Users, Info, Phone, Video } from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { getSender, getSenderFull } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';
import { useSocket } from '../../hooks/useSocket';
import { GroupInfoModal } from './GroupInfoModal';
import { ProfileModal } from './ProfileModal';

export const ChatHeader = ({ chat, onBack }) => {
  const { user } = useAuth();
  const { isUserOnline } = useSocket();
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  if (!chat) return null;

  const isGroup = chat.isGroupChat;
  const otherUser = !isGroup ? getSenderFull(user, chat.users) : null;
  const isOnline = otherUser ? isUserOnline(otherUser._id) : false;
  const chatTitle = isGroup ? chat.chatName : getSender(user, chat.users);
  const avatarSrc = isGroup ? chat.groupIcon : otherUser?.avatar;

  return (
    <>
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-white border-b border-slate-100/90 shadow-stitch-sm z-10">
        {/* Left Side: Back button on mobile + Avatar + Title + Status */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile Back Button */}
          <button
            onClick={onBack}
            className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <ArrowLeft size={20} />
          </button>

          {/* Avatar */}
          <div
            className="cursor-pointer"
            onClick={() => (isGroup ? setShowGroupModal(true) : setShowProfileModal(true))}
          >
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

          {/* User / Group Info */}
          <div
            className="min-w-0 cursor-pointer"
            onClick={() => (isGroup ? setShowGroupModal(true) : setShowProfileModal(true))}
          >
            <h3 className="text-sm sm:text-base font-semibold text-slate-900 truncate">
              {chatTitle}
            </h3>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 truncate">
              {isGroup ? (
                <span>{chat.users?.length || 0} members</span>
              ) : (
                <>
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      isOnline ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  />
                  <span>{isOnline ? 'Online' : 'Offline'}</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex items-center gap-1">
          {isGroup ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowGroupModal(true)}
              className="hidden sm:inline-flex"
            >
              <Info size={16} />
              <span>Group Info</span>
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowProfileModal(true)}
              className="hidden sm:inline-flex"
            >
              <Info size={16} />
              <span>Profile</span>
            </Button>
          )}

          <button
            onClick={() => (isGroup ? setShowGroupModal(true) : setShowProfileModal(true))}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors sm:hidden"
          >
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Group Info Modal */}
      {isGroup && (
        <GroupInfoModal
          isOpen={showGroupModal}
          onClose={() => setShowGroupModal(false)}
          chat={chat}
        />
      )}

      {/* 1-on-1 User Profile Modal */}
      {!isGroup && otherUser && (
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          user={otherUser}
          isOnline={isOnline}
        />
      )}
    </>
  );
};
