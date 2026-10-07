import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { Users, Crown, UserMinus, UserPlus, Edit2, LogOut, Check } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useSocket } from '../../hooks/useSocket';
import { useChat } from '../../hooks/useChat';
import * as chatService from '../../api/chatService';
import { searchUsers } from '../../api/userService';

export const GroupInfoModal = ({ isOpen, onClose, chat }) => {
  const { user } = useAuth();
  const { isUserOnline } = useSocket();
  const { setChats, setSelectedChat, loadChats } = useChat();

  const [groupName, setGroupName] = useState(chat?.chatName || '');
  const [isEditingName, setIsEditingName] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [error, setError] = useState('');

  if (!chat) return null;

  const isAdmin = chat.groupAdmin?._id === user?._id;

  const handleRename = async () => {
    if (!groupName.trim() || groupName === chat.chatName) {
      setIsEditingName(false);
      return;
    }

    setRenaming(true);
    try {
      const updated = await chatService.renameGroup(chat._id, groupName.trim());
      setSelectedChat(updated);
      setChats((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
      setIsEditingName(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to rename group');
    } finally {
      setRenaming(false);
    }
  };

  const handleSearchUsers = async (e) => {
    const q = e.target.value;
    setSearch(q);
    setLoadingSearch(true);
    try {
      const data = await searchUsers(q);
      // Filter out users already in group
      const filtered = data.filter(
        (u) => !chat.users.some((existing) => existing._id === u._id)
      );
      setSearchResults(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleAddUser = async (userToAdd) => {
    try {
      const updated = await chatService.addToGroup(chat._id, userToAdd._id);
      setSelectedChat(updated);
      setChats((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
      setIsAddingMember(false);
      setSearch('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add user');
    }
  };

  const handleRemoveUser = async (userToRemove) => {
    try {
      const updated = await chatService.removeFromGroup(chat._id, userToRemove._id);
      if (userToRemove._id === user._id) {
        // Logged-in user left the group
        setSelectedChat(null);
        await loadChats();
        onClose();
      } else {
        setSelectedChat(updated);
        setChats((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove user');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Group Details">
      <div className="space-y-5">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        {/* Group Name & Edit */}
        <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
          {isEditingName ? (
            <div className="flex items-center gap-2 flex-1 mr-2">
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full text-sm font-semibold bg-white border border-brand-300 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                autoFocus
              />
              <Button size="sm" onClick={handleRename} isLoading={renaming}>
                <Check size={14} />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center font-semibold">
                <Users size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{chat.chatName}</h3>
                <p className="text-xs text-slate-500">{chat.users?.length} members</p>
              </div>
            </div>
          )}

          {!isEditingName && (
            <button
              onClick={() => setIsEditingName(true)}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
              title="Rename Group"
            >
              <Edit2 size={16} />
            </button>
          )}
        </div>

        {/* Members List */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Group Members ({chat.users?.length})
            </span>
            {isAdmin && !isAddingMember && (
              <button
                onClick={() => setIsAddingMember(true)}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <UserPlus size={14} />
                <span>Add Member</span>
              </button>
            )}
          </div>

          {/* Add member search box if opened */}
          {isAddingMember && (
            <div className="mb-3 p-3 bg-brand-50/50 border border-brand-200/60 rounded-2xl space-y-2">
              <Input
                placeholder="Search user to add..."
                value={search}
                onChange={handleSearchUsers}
                icon={Users}
                autoFocus
              />
              <div className="max-h-36 overflow-y-auto divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
                {loadingSearch ? (
                  <p className="p-2 text-center text-xs text-slate-400">Searching...</p>
                ) : searchResults.length === 0 ? (
                  <p className="p-2 text-center text-xs text-slate-400">No new users to add</p>
                ) : (
                  searchResults.map((u) => (
                    <div
                      key={u._id}
                      className="flex items-center justify-between p-2 hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar src={u.avatar} name={u.username} size="sm" />
                        <span className="text-xs font-medium text-slate-800">
                          {u.username}
                        </span>
                      </div>
                      <Button size="sm" onClick={() => handleAddUser(u)}>
                        Add
                      </Button>
                    </div>
                  ))
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAddingMember(false);
                  setSearch('');
                }}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          )}

          <div className="border border-slate-200/80 rounded-2xl max-h-52 overflow-y-auto divide-y divide-slate-100">
            {chat.users?.map((member) => {
              const isMemberAdmin = chat.groupAdmin?._id === member._id;
              const online = isUserOnline(member._id);

              return (
                <div
                  key={member._id}
                  className="flex items-center justify-between p-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar
                      src={member.avatar}
                      name={member.username}
                      size="sm"
                      showStatus={true}
                      isOnline={online}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-slate-800 truncate">
                          {member.username}
                        </span>
                        {member._id === user?._id && (
                          <span className="text-[10px] text-slate-400 font-normal">
                            (You)
                          </span>
                        )}
                        {isMemberAdmin && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded">
                            <Crown size={10} /> Admin
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 truncate block">
                        {online ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>

                  {/* Actions: Admin can remove members, or user can leave */}
                  {isAdmin && member._id !== user._id && (
                    <button
                      onClick={() => handleRemoveUser(member)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove from group"
                    >
                      <UserMinus size={16} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Leave Group Button */}
        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <Button
            variant="danger"
            onClick={() => handleRemoveUser(user)}
            className="w-full sm:w-auto"
          >
            <LogOut size={16} />
            <span>Leave Group</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};
