import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { Search, X, Check, Users } from 'lucide-react';
import { searchUsers } from '../../api/userService';
import { useChat } from '../../hooks/useChat';

export const CreateGroupModal = ({ isOpen, onClose }) => {
  const [groupName, setGroupName] = useState('');
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { createGroup } = useChat();

  useEffect(() => {
    if (!isOpen) {
      setGroupName('');
      setSearch('');
      setSearchResults([]);
      setSelectedUsers([]);
      setError('');
      return;
    }

    const fetchInitialUsers = async () => {
      setLoadingSearch(true);
      try {
        const users = await searchUsers('');
        setSearchResults(users);
      } catch (err) {
        console.error('Failed to load users for group creation', err);
      } finally {
        setLoadingSearch(false);
      }
    };

    fetchInitialUsers();
  }, [isOpen]);

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearch(query);
    setLoadingSearch(true);
    try {
      const users = await searchUsers(query);
      setSearchResults(users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleToggleUser = (user) => {
    if (selectedUsers.some((u) => u._id === user._id)) {
      setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) {
      setError('Please provide a group name');
      return;
    }
    if (selectedUsers.length < 2) {
      setError('Select at least 2 members to create a group');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const userIds = selectedUsers.map((u) => u._id);
      await createGroup(groupName.trim(), userIds);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create group');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Group Room">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        {/* Group Name Input */}
        <Input
          label="Group Name"
          placeholder="e.g. CS50 Project Squad"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          icon={Users}
          required
        />

        {/* Selected Members Chips */}
        {selectedUsers.length > 0 && (
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Selected Members ({selectedUsers.length})
            </label>
            <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200/80 rounded-xl max-h-24 overflow-y-auto">
              {selectedUsers.map((u) => (
                <span
                  key={u._id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-50 text-brand-700 border border-brand-200/80 text-xs font-medium rounded-lg"
                >
                  <Avatar src={u.avatar} name={u.username} size="sm" className="w-4 h-4 text-[9px]" />
                  <span>{u.username}</span>
                  <button
                    type="button"
                    onClick={() => handleToggleUser(u)}
                    className="hover:text-brand-900"
                  >
                    <X size={13} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Search Users Input */}
        <Input
          label="Add Members"
          placeholder="Search by username or email..."
          value={search}
          onChange={handleSearchChange}
          icon={Search}
        />

        {/* User Search List */}
        <div className="border border-slate-200/80 rounded-xl max-h-48 overflow-y-auto divide-y divide-slate-100">
          {loadingSearch ? (
            <div className="p-4 text-center text-xs text-slate-400">
              Searching users...
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400">
              No users found.
            </div>
          ) : (
            searchResults.map((user) => {
              const isSelected = selectedUsers.some((u) => u._id === user._id);
              return (
                <div
                  key={user._id}
                  onClick={() => handleToggleUser(user)}
                  className={`flex items-center justify-between p-2.5 cursor-pointer transition-colors ${
                    isSelected ? 'bg-brand-50/70' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar src={user.avatar} name={user.username} size="sm" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">
                        {user.username}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-brand-600 border-brand-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check size={14} />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={submitting}>
            Create Group
          </Button>
        </div>
      </form>
    </Modal>
  );
};
