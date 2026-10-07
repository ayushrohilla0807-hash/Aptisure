import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { Search, MessageSquare, ArrowRight } from 'lucide-react';
import { searchUsers } from '../../api/userService';
import { useChat } from '../../hooks/useChat';
import { useSocket } from '../../hooks/useSocket';

export const NewChatModal = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submittingId, setSubmittingId] = useState(null);

  const { accessOrCreateChat } = useChat();
  const { isUserOnline } = useSocket();

  useEffect(() => {
    if (!isOpen) {
      setSearch('');
      setUsers([]);
      setSubmittingId(null);
      return;
    }

    const loadUsers = async () => {
      setLoading(true);
      try {
        const data = await searchUsers('');
        setUsers(data);
      } catch (err) {
        console.error('Failed to load users:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [isOpen]);

  const handleSearchChange = async (e) => {
    const q = e.target.value;
    setSearch(q);
    setLoading(true);
    try {
      const data = await searchUsers(q);
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = async (user) => {
    setSubmittingId(user._id);
    try {
      await accessOrCreateChat(user._id);
      onClose();
    } catch (err) {
      console.error('Failed to start chat:', err);
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Direct Message">
      <div className="space-y-4">
        <Input
          placeholder="Search by username or email..."
          value={search}
          onChange={handleSearchChange}
          icon={Search}
          autoFocus
        />

        <div className="border border-slate-200/80 rounded-2xl max-h-64 overflow-y-auto divide-y divide-slate-100">
          {loading ? (
            <div className="p-6 text-center text-xs text-slate-400">
              Searching registered users...
            </div>
          ) : users.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No matching users found.
            </div>
          ) : (
            users.map((user) => {
              const online = isUserOnline(user._id);
              return (
                <div
                  key={user._id}
                  onClick={() => handleSelectUser(user)}
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-brand-50/50 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar
                      src={user.avatar}
                      name={user.username}
                      size="md"
                      showStatus={true}
                      isOnline={online}
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-slate-800 group-hover:text-brand-700 truncate">
                        {user.username}
                      </h4>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                        online
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {online ? 'Online' : 'Offline'}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      isLoading={submittingId === user._id}
                      className="group-hover:bg-brand-100 text-brand-600"
                    >
                      <ArrowRight size={16} />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
};
