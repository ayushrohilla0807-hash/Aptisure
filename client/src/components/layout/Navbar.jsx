import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Bell, LogOut, User as UserIcon, ChevronDown } from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { useAuth } from '../../hooks/useAuth';
import { useChat } from '../../hooks/useChat';
import { ProfileModal } from '../chat/ProfileModal';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { notifications, setSelectedChat, setNotifications } = useChat();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSelfProfile, setShowSelfProfile] = useState(false);

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectNotification = (notif) => {
    setSelectedChat(notif.chat);
    setNotifications((prev) => prev.filter((n) => n._id !== notif._id));
    setShowNotifications(false);
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between shadow-stitch-sm z-30 select-none">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center shadow-stitch-sm">
            <MessageSquare size={22} />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Aptisure<span className="text-brand-600">Chat</span>
            </h1>
          </div>
        </div>

        {/* Right Side: Notification Bell + User Menu */}
        <div className="flex items-center gap-3 sm:gap-4">

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              title="Notifications"
            >
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-white rounded-2xl shadow-stitch-floating border border-slate-200/80 p-2 z-50 animate-fade-in">
                <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Notifications ({notifications.length})
                  </span>
                  {notifications.length > 0 && (
                    <button
                      onClick={() => setNotifications([])}
                      className="text-[11px] text-brand-600 hover:underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 py-1">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-center text-xs text-slate-400">
                      No new notifications
                    </p>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif._id}
                        onClick={() => handleSelectNotification(notif)}
                        className="p-2.5 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                      >
                        <p className="text-xs font-semibold text-slate-800">
                          {notif.sender?.username}{' '}
                          <span className="font-normal text-slate-500">
                            {notif.chat?.isGroupChat
                              ? `in ${notif.chat.chatName}`
                              : 'sent a message'}
                          </span>
                        </p>
                        <p className="text-xs text-slate-600 truncate mt-0.5">
                          {notif.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2.5 p-1 pl-2 hover:bg-slate-100 rounded-2xl transition-colors"
            >
              <Avatar
                src={user?.avatar}
                name={user?.username}
                size="sm"
                showStatus={true}
                isOnline={true}
              />
              <span className="text-xs font-semibold text-slate-800 hidden sm:block max-w-[100px] truncate">
                {user?.username}
              </span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-stitch-floating border border-slate-200/80 p-1.5 z-50 animate-fade-in">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {user?.username}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                </div>

                <button
                  onClick={() => {
                    setShowDropdown(false);
                    setShowSelfProfile(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <UserIcon size={16} />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => {
                    setShowDropdown(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors mt-1"
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Self Profile Modal */}
      {showSelfProfile && (
        <ProfileModal
          isOpen={showSelfProfile}
          onClose={() => setShowSelfProfile(false)}
          user={user}
          isOnline={true}
        />
      )}
    </>
  );
};
