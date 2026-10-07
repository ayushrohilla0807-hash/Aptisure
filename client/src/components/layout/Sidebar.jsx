import React, { useState } from 'react';
import { Search, Plus, Users, MessageSquarePlus } from 'lucide-react';
import { ConversationList } from '../chat/ConversationList';
import { Button } from '../common/Button';
import { useChat } from '../../hooks/useChat';

export const Sidebar = ({ onOpenNewChat, onOpenGroupModal }) => {
  const { chats, selectedChat } = useChat();
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'direct' | 'groups'
  const [searchQuery, setSearchQuery] = useState('');

  const directCount = chats.filter((c) => !c.isGroupChat).length;
  const groupsCount = chats.filter((c) => c.isGroupChat).length;

  return (
    <aside
      className={`w-full md:w-80 lg:w-96 flex-shrink-0 flex flex-col bg-white border-r border-slate-200/80 h-full ${
        selectedChat ? 'hidden md:flex' : 'flex'
      }`}
    >
      {/* Sidebar Header: Actions */}
      <div className="p-4 pb-2 border-b border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Chats</h2>
          <div className="flex items-center gap-1.5">
            <Button
              variant="secondary"
              size="sm"
              onClick={onOpenNewChat}
              title="New Direct Message"
              className="px-2.5 py-1.5 text-xs"
            >
              <MessageSquarePlus size={15} />
              <span>Direct</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onOpenGroupModal}
              title="Create Group Room"
              className="px-2.5 py-1.5 text-xs"
            >
              <Users size={15} />
              <span>Group</span>
            </Button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-slate-100/80 border border-transparent rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
          />
        </div>

        {/* Filter Tabs (All / Direct / Groups) */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl gap-0.5">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-1.5 px-1 text-[11px] sm:text-xs font-semibold rounded-lg transition-all truncate text-center ${
              activeTab === 'all'
                ? 'bg-white text-brand-700 shadow-stitch-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({chats.length})
          </button>
          <button
            onClick={() => setActiveTab('direct')}
            className={`flex-1 py-1.5 px-1 text-[11px] sm:text-xs font-semibold rounded-lg transition-all truncate text-center ${
              activeTab === 'direct'
                ? 'bg-white text-brand-700 shadow-stitch-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Direct ({directCount})
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`flex-1 py-1.5 px-1 text-[11px] sm:text-xs font-semibold rounded-lg transition-all truncate text-center ${
              activeTab === 'groups'
                ? 'bg-white text-brand-700 shadow-stitch-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Groups ({groupsCount})
          </button>
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        <ConversationList
          chats={chats}
          filter={activeTab}
          searchQuery={searchQuery}
        />
      </div>
    </aside>
  );
};
