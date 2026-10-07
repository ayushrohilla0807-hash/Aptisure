import React from 'react';
import { MessageSquare, ShieldCheck, Zap, Users } from 'lucide-react';
import { Button } from '../common/Button';

export const EmptyChatState = ({ onOpenNewChat, onOpenGroupModal }) => {
  return (
    <div className="flex-1 hidden md:flex flex-col items-center justify-center p-8 bg-slate-50/50 text-center select-none">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-100 shadow-stitch-lg">
        {/* App Logo / Icon */}
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center shadow-stitch">
          <MessageSquare size={32} />
        </div>

        <h2 className="text-xl font-bold text-slate-800 tracking-tight">
          Welcome to Aptisure Chat
        </h2>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
          Select a conversation from the sidebar or start a new real-time chat with classmates and team members.
        </p>

        {/* Feature Pills */}
        <div className="grid grid-cols-2 gap-3 mt-6 mb-8 text-left">
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <Zap size={18} className="text-amber-500 flex-shrink-0" />
            <span className="text-xs font-medium text-slate-700">Real-Time Messaging</span>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <ShieldCheck size={18} className="text-emerald-500 flex-shrink-0" />
            <span className="text-xs font-medium text-slate-700">JWT Authentication</span>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <Users size={18} className="text-brand-500 flex-shrink-0" />
            <span className="text-xs font-medium text-slate-700">Group Chat Rooms</span>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0 ml-1"></span>
            <span className="text-xs font-medium text-slate-700">Live Presence</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="primary" onClick={onOpenNewChat} className="w-full sm:w-auto">
            Find People to Chat
          </Button>
          <Button variant="secondary" onClick={onOpenGroupModal} className="w-full sm:w-auto">
            Create Group Room
          </Button>
        </div>
      </div>
    </div>
  );
};
